
export type Screen = 
  | 'WELCOME'
  | 'ROLE_SELECTION'
  | 'LOGIN' 
  | 'COMPLETE_PROFILE'
  | 'HOME' 
  | 'CUSTOMER_CHAT' 
  | 'COURIER_CHAT' 
  | 'PROFILE' 
  | 'ORDER_SUCCESS' 
  | 'INVOICE'
  | 'BUDGET_SELECTION'
  | 'CITY_SELECTION'
  | 'SEARCHING_EXPERT'
  | 'COURIER_LOGIN'
  | 'COURIER_PENDING'
  | 'COURIER_HOME'
  | 'CANCEL_REASONS';

export type UserRole = 'customer' | 'courier';

export interface Order {
  id: string;
  item: string;
  price: number;
  status: 'pending' | 'delivered' | 'processing' | 'cancelled';
  date: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  time: string;
  isInvoice?: boolean;
  invoiceData?: {
    description: string;
    giftPrice: number;
    serviceFee: number;
    deliveryFee: number;
    total: number;
  };
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
}
