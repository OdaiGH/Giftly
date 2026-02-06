const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://971c-37-106-14-206.ngrok-free.app';

export interface SendOTPRequest {
  phone_number: string;
}

export interface OTPVerifyRequest {
  phone_number: string;
  otp: string;
  email?: string;
  name?: string;
  date_of_birth?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  needs_profile: boolean;
}

export const sendOTP = async (phoneNumber: string): Promise<{message: string, otp: string}> => {
  const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone_number: phoneNumber }),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to send OTP';
    try {
      const error = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export interface CreateOrderRequest {
  description?: string;
  city_id: number;
  delivery_date: string; // ISO string
}

export interface OrderResponse {
  id: number;
  order_id: string;
  created_by_user_id: number;
  assigned_to_user_id: number | null;
  description: string | null;
  creation_date: string;
  delivery_date: string | null;
  status: string;
  comments: string | null;
  updated_at: string;
  city_id: number;
}

export const createOrder = async (token: string, data: CreateOrderRequest): Promise<OrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/orders/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to create order';
    try {
      const error = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const getUserOrders = async (token: string): Promise<OrderResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/orders/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to fetch orders';
    try {
      const error = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const getOrder = async (token: string, orderId: string): Promise<OrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to fetch order';
    try {
      const error = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export interface CancelOrderRequest {
  reason: string;
}

export const cancelOrder = async (token: string, orderId: string, data: CancelOrderRequest): Promise<OrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to cancel order';
    try {
      const error = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const verifyOTP = async (data: OTPVerifyRequest): Promise<TokenResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to verify OTP';
    try {
      const error = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch (e) {
      // If response doesn't have JSON body, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export interface UserDetails {
  id: number;
  phone_number: string;
  email: string;
  name: string;
  date_of_birth: string | null;
  is_verified: boolean;
}

export const getUserDetails = async (token: string): Promise<UserDetails> => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to fetch user details';
    try {
      const error = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export interface UpdateUserDetails {
  name?: string;
  email?: string;
  date_of_birth?: string;
}

export const updateUserDetails = async (token: string, data: UpdateUserDetails): Promise<UserDetails> => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    try {
      const error = await response.json();
      if (error.detail && typeof error.detail === 'object') {
        // Field-specific errors
        throw error.detail;
      } else {
        // Generic error
        throw new Error(error.detail || 'Failed to update user details');
      }
    } catch (parseError) {
      throw new Error(response.statusText || 'Failed to update user details');
    }
  }

  return response.json();
};

export const refreshAccessToken = async (refreshToken: string): Promise<TokenResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to refresh token';
    try {
      const error = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const logout = async (token: string): Promise<{message: string}> => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to logout';
    try {
      const error = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export interface InvoiceResponse {
  id: number;
  invoice_id: string;
  order_id: number;
  full_amount: number;
  service_fee: number;
  order_only_price: number;
  courier_fee: number;
  status: string;
  description: string | null;
  comment: string | null;
  sent_to_user_via_email: boolean;
  sent_at: string | null;
  due_date: string | null;
  tax_amount: number;
  discount_amount: number;
  created_at: string;
  updated_at: string;
}

export const getInvoiceByOrder = async (token: string, orderId: number): Promise<InvoiceResponse> => {
  const response = await fetch(`${API_BASE_URL}/invoices/order/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to fetch invoice';
    try {
      const error = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const downloadInvoicePDF = async (token: string, orderId: number): Promise<Blob> => {
  const response = await fetch(`${API_BASE_URL}/invoices/order/${orderId}/pdf`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMessage = 'Failed to download PDF';
    try {
      const error = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.blob();
};

export interface CompleteProfileRequest {
  phone_number: string;
  name: string;
  email: string;
  date_of_birth: string;
}

export const completeProfile = async (data: CompleteProfileRequest): Promise<TokenResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/complete-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to complete profile';
    try {
      const error = await response.json();
      errorMessage = error.detail || errorMessage;
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};
