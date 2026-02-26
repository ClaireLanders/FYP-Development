# Helper functions for generating chart data for the analytics feature in user story 8
# COALESCE used to return 0 for periods with no data (W3Schools, 2025)
# Date arithmetic uses Python datetime and calendar modules (Gupta, R., 2025)

from datetime import datetime, timedelta
import calendar


# WEEK CHART

def generate_week_chart(cur, branch_id, ref, start_date, end_date):

    # Initialize arrays for all 7 days
    listed_by_day = [0, 0, 0, 0, 0, 0, 0]
    rescued_by_day = [0, 0, 0, 0, 0, 0, 0]

    # Query items listed grouped by day of week
    cur.execute(
        """
        SELECT 
            EXTRACT(DOW FROM l.created_at) as day_of_week,
            COALESCE(SUM(lli.quantity), 0) as items_listed
        FROM listing l
        JOIN listing_line_item lli ON l.listing_id = lli.listing_id
        JOIN user_branch ub ON l.user_branch_id = ub.user_branch_id
        WHERE ub.branch_id = %s
          AND l.created_at >= %s
          AND l.created_at <= %s
        GROUP BY EXTRACT(DOW FROM l.created_at)
        """,
        (branch_id, start_date, end_date)
    )

    # Fill in data from query results
    for row in cur.fetchall():
        pg_dow = int(row[0])
        monday_index = (pg_dow + 6) % 7
        listed_by_day[monday_index] = int(row[1])

    # Query items rescued grouped by day of week
    cur.execute(
        """
        SELECT 
            EXTRACT(DOW FROM p.completed_at) as day_of_week,
            COALESCE(SUM(lci.quantity), 0) as items_rescued
        FROM pickup p
        JOIN claim c ON p.claim_id = c.claim_id
        JOIN listing_claim_item lci ON c.claim_id = lci.claim_id
        JOIN listing_line_item lli ON lci.listing_line_item_id = lli.listing_line_item_id
        JOIN listing l ON lli.listing_id = l.listing_id
        JOIN user_branch ub ON l.user_branch_id = ub.user_branch_id
        WHERE ub.branch_id = %s
          AND p.complete = TRUE
          AND p.completed_at >= %s
          AND p.completed_at <= %s
        GROUP BY EXTRACT(DOW FROM p.completed_at)
        """,
        (branch_id, start_date, end_date)
    )

    # Fill in data from query results
    for row in cur.fetchall():
        pg_dow = int(row[0])
        monday_index = (pg_dow + 6) % 7
        rescued_by_day[monday_index] = int(row[1])

    return {
        "title": "This Week - Daily Breakdown",
        "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        "datasets": [
            {
                "label": "Items Listed",
                "data": listed_by_day
            },
            {
                "label": "Items Rescued",
                "data": rescued_by_day
            }
        ]
    }



# MONTH CHART


def generate_month_chart(cur, branch_id, ref, start_date, end_date):

    # Get first and last day of month
    first_day = datetime(ref.year, ref.month, 1)
    last_day_num = calendar.monthrange(ref.year, ref.month)[1]
    last_day = datetime(ref.year, ref.month, last_day_num, 23, 59, 59)

    # Calculate weeks in this month
    week_labels = []
    week_listed = []
    week_rescued = []

    # Start from first Monday on or before month start
    current = first_day
    if current.weekday() != 0:  # Not Monday
        current = current - timedelta(days=current.weekday())

    week_num = 1
    while current <= last_day:
        week_start = datetime(current.year, current.month, current.day, 0, 0, 0)
        week_end_date = current + timedelta(days=6)
        week_end = datetime(week_end_date.year, week_end_date.month, week_end_date.day, 23, 59, 59)

        # Only include weeks that overlap with this month
        if week_end >= first_day and week_start <= last_day:
            week_labels.append(f"Week {week_num}")

            # Query items listed for this week
            cur.execute(
                """
                SELECT COALESCE(SUM(lli.quantity), 0) as items_listed
                FROM listing l
                JOIN listing_line_item lli ON l.listing_id = lli.listing_id
                JOIN user_branch ub ON l.user_branch_id = ub.user_branch_id
                WHERE ub.branch_id = %s
                  AND l.created_at >= %s
                  AND l.created_at <= %s
                  AND l.created_at >= %s
                  AND l.created_at <= %s
                """,
                (branch_id, week_start, week_end, start_date, end_date)
            )
            result = cur.fetchone()
            week_listed.append(int(result[0]) if result else 0)

            # Query items rescued for this week
            cur.execute(
                """
                SELECT COALESCE(SUM(lci.quantity), 0) as items_rescued
                FROM pickup p
                JOIN claim c ON p.claim_id = c.claim_id
                JOIN listing_claim_item lci ON c.claim_id = lci.claim_id
                JOIN listing_line_item lli ON lci.listing_line_item_id = lli.listing_line_item_id
                JOIN listing l ON lli.listing_id = l.listing_id
                JOIN user_branch ub ON l.user_branch_id = ub.user_branch_id
                WHERE ub.branch_id = %s
                  AND p.complete = TRUE
                  AND p.completed_at >= %s
                  AND p.completed_at <= %s
                  AND p.completed_at >= %s
                  AND p.completed_at <= %s
                """,
                (branch_id, week_start, week_end, start_date, end_date)
            )
            result = cur.fetchone()
            week_rescued.append(int(result[0]) if result else 0)

            week_num += 1

        current = current + timedelta(days=7)

    return {
        "title": f"{ref.strftime('%B %Y')} - Weekly Breakdown",
        "labels": week_labels,
        "datasets": [
            {
                "label": "Items Listed",
                "data": week_listed
            },
            {
                "label": "Items Rescued",
                "data": week_rescued
            }
        ]
    }



# YEAR CHART

def generate_year_chart(cur, branch_id, ref, start_date, end_date):

    # Initialize arrays for all 12 months
    listed_by_month = [0] * 12
    rescued_by_month = [0] * 12

    # Query items listed grouped by month
    cur.execute(
        """
        SELECT 
            EXTRACT(MONTH FROM l.created_at) as month_num,
            COALESCE(SUM(lli.quantity), 0) as items_listed
        FROM listing l
        JOIN listing_line_item lli ON l.listing_id = lli.listing_id
        JOIN user_branch ub ON l.user_branch_id = ub.user_branch_id
        WHERE ub.branch_id = %s
          AND l.created_at >= %s
          AND l.created_at <= %s
        GROUP BY EXTRACT(MONTH FROM l.created_at)
        """,
        (branch_id, start_date, end_date)
    )

    # Fill in data from query results
    for row in cur.fetchall():
        month_num = int(row[0])
        listed_by_month[month_num - 1] = int(row[1])

    # Query items rescued grouped by month
    cur.execute(
        """
        SELECT 
            EXTRACT(MONTH FROM p.completed_at) as month_num,
            COALESCE(SUM(lci.quantity), 0) as items_rescued
        FROM pickup p
        JOIN claim c ON p.claim_id = c.claim_id
        JOIN listing_claim_item lci ON c.claim_id = lci.claim_id
        JOIN listing_line_item lli ON lci.listing_line_item_id = lli.listing_line_item_id
        JOIN listing l ON lli.listing_id = l.listing_id
        JOIN user_branch ub ON l.user_branch_id = ub.user_branch_id
        WHERE ub.branch_id = %s
          AND p.complete = TRUE
          AND p.completed_at >= %s
          AND p.completed_at <= %s
        GROUP BY EXTRACT(MONTH FROM p.completed_at)
        """,
        (branch_id, start_date, end_date)
    )

    # Filling in data from query results
    for row in cur.fetchall():
        month_num = int(row[0])
        rescued_by_month[month_num - 1] = int(row[1])

    return {
        "title": f"{ref.year} - Monthly Breakdown",
        "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        "datasets": [
            {
                "label": "Items Listed",
                "data": listed_by_month
            },
            {
                "label": "Items Rescued",
                "data": rescued_by_month
            }
        ]
    }



