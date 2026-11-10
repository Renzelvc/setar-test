import type {
  CarRegistration,
  CarRegistrationUpdate,
  NewCarRegistration,
} from '@/types/car-registration';

const API_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
const RESOURCE_URL = `${API_URL}/carRegistrations`;

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(
      `Car registration API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

export function createCarRegistration(
  registration: NewCarRegistration,
): Promise<CarRegistration> {
  return request<CarRegistration>(RESOURCE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registration),
  });
}

export function updateCarRegistration(
  id: number,
  registration: CarRegistrationUpdate,
): Promise<CarRegistration> {
  return request<CarRegistration>(`${RESOURCE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registration),
  });
}

export function deleteCarRegistration(id: number): Promise<void> {
  return fetch(`${RESOURCE_URL}/${id}`, { method: 'DELETE' }).then(
    (response) => {
      if (!response.ok) {
        throw new Error(
          `Car registration API request failed: ${response.status} ${response.statusText}`,
        );
      }
    },
  );
}
