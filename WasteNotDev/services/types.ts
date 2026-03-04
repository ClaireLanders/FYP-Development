// Core data types matching backend API
// Defines TypeScript interfaces
// Ensures type safety across the app

export interface Product {
  product_id: string;
  product_name: string;
}

export interface ListingLineItem {
  listing_line_item_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
}

export interface Listing {
  listing_id: string;
  org_id: string;
  org_name: string;
  branch_id: string;
  branch_name: string;
  branch_address: string;
  created_at: string;
  items: ListingLineItem[];
}

export interface CreateListingRequest {
  user_branch_id: string;
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
}

export interface UpdateListingItemRequest {
  listing_line_item_id: string;
  quantity: number;
}

export interface ClaimRequest {
  user_branch_id: string;
  items: Array<{
    listing_line_item_id: string;
    quantity: number;
  }>;
}

export interface ApiError {
  message: string;
  status?: number;
}


// user story 7 & 8: analytics
export interface BasicMetrics{
    period:{
        start_date: string;
        end_date: string;
        period_type: string;
        reference_date: string;
        label: string;
    };
    listings_count: number;
    total_items_listed: number;
    pickups_completed: number;
    total_items_rescued: number;
    rescue_rate: number;
}

// User Story 8
// Charts
export interface ChartDataset {
  label: string;  // "Items Listed" or "Items Rescued"
  data: number[];
}
export interface Chart {
  title: string;
  labels: string[];  // x-axis labels
  datasets: ChartDataset[];
}
export interface ChartResponse {
  period: {
    start_date: string;
    end_date: string;
    period_type: string;
    reference_date: string;
    label: string;
  };
  chart: Chart;
}

// Chats
export interface ChatMessage {
  question: string;
  answer: string;
  timestamp: Date;
}

export interface ChatResponse {
  answer: string;
  metrics: BasicMetrics;
}
// User Story 9 & 10: User Management
export interface OrgUser {
  user_id: string;
  user_email: string;
  user_type: string;
  org_name: string;
}

export interface BranchUser {
  user_branch_id: string;
  user_id: string;
  user_email: string;
  user_type: string;
  branch_name: string;
}

export interface CreateOrgUserRequest {
  user_email: string;
  user_type: string;
  org_id: string;
  password: string;
}

export interface AssignBranchRequest {
  user_id: string;
  org_id: string;
  branch_id: string;
}
// User Story 11 & 12: Organisation Registration
export interface OrgRegistrationRequest {
  org_type: string;
  org_name: string;
  org_email: string;
  branch_name: string;
  branch_location: string;
  manager_email: string;
  manager_password: string;
}

export interface OrgRegistrationResponse {
  org_id: string;
  branch_id: string;
  user_id: string;
  user_branch_id: string;
  message: string;
}

// User Story 13: Product Management
export interface ProductOutput {
  product_id: string;
  branch_id: string;
  product_name: string;
  product_desc: string | null;
  product_image: string | null;
  product_price: number | null;
  category: string | null;
}

// User Authentication
export interface LoginRequest {
  user_email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  user_email: string;
  user_type: string;
  role: string;
  org_id: string;
  branch_id: string | null;
  branch_name: string | null;
  user_branch_id: string | null;
  org_name: string;
}

// REFERENCES
// ChatGPT. (2025, November 7). Retrieved from chatgpt.com: https://chatgpt.com/c/69176485-1458-8331-b053-4df0abe35697
// ChatGPT. (2025, November 11). Retrieved from chatgpt.com: https://chatgpt.com/c/69203ef4-2430-8326-be09-e8e39fed78c5
// ChatGPT. (2026, January 23). Retrieved from chatgpt.com: https://chatgpt.com/c/6973dd84-c8bc-832c-a62c-d1ceef72c186
// Expo. (2024, June 15). Create a project. Retrieved from docs.expo.dev: https://docs.expo.dev/get-started/create-a-project/
// Expo. (2025, July 10). Set up your environment. Retrieved from docs.expo.dev: https://docs.expo.dev/get-started/set-up-your-environment/?platform=android&device=simulated&mode=development-build
// Grimm, S. (2024, July 9). From React to React Native in 12 Minutes. Retrieved from Youtube: https://www.youtube.com/watch?v=6UB3gw3SKfY
// Kodaps Academy. (2023, March 29). React Native vs React JS in 2024 Differences and Shared Features. Retrieved from Youtube: https://www.youtube.com/watch?v=MSgIRdyJ6rk
// NeuralNine. (2023, March 7). PostgreSQL in Python. Retrieved from youttube.com: https://www.youtube.com/watch?v=miEFm1CyjfM&t=33s
// Programming with Mosh. (2020, May 11). React Native Tutorial for Beginners -Build a React Native App. Retrieved from Youtube: https://www.youtube.com/watch?v=0-S5a0eXPoc
// React Native. (2025, December 16). Introduction. Retrieved from reactnative.dev/docs: https://reactnative.dev/docs/getting-started
// Tim, T. W. (2024, November 19). How to Create a FastAPI & React Project-Python Backend + React Frontend. Retrieved from youtube.com: https://www.youtube.com/watch?v=aSdVU9-SxH4
// W3 Schools. (2025, November 16). SQL Server COALESCE() Function. Retrieved from w3schools.com: https://www.w3schools.com/sql/func_sqlserver_coalesce.asp
// W3Schools. (2025, November 18). Web APIs - Introduction. Retrieved from w3schools.com: https://www.w3schools.com/js/js_api_intro.asp
// W3Schools. (2025, November 19). SQL LEFT JOIN Keyword. Retrieved from w3schools.com: https://www.w3schools.com/sql/sql_join_left.asp
// Woodworth, S. (2026, January). IS4447 Modules. Retrieved from ucc.instructure.com: https://ucc.instructure.com/courses/86289
// Yamamoto, T. (2025, August 22). Preventing Race Conditions with SELECT FOR UPDATE in Web Applications. Retrieved from leapcell.io: https://leapcell.io/blog/preventing-race-conditions-with-select-for-update-in-web-applications
// YpnConnect-Soft. (2025, July 21). Styling in react vs reactnative (Web vs Mobile development). Retrieved from Youtube: https://www.youtube.com/watch?v=4CNERtrb3oQ