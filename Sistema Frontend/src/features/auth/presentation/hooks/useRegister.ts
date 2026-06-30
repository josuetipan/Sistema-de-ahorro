import { useCallback, useState } from 'react';
import type { RegisterFormData } from '../../application/schemas/login.schema';
import { postRegister } from '../../infrastructure/api/auth.api';

export function useRegister() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = useCallback(async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      return await postRegister({
        fullName: data.fullName,
        identification: data.identification,
        email: data.email,
        phoneNumber: data.phoneNumber,
        roleCode: 'CUSTOMER',
        password: data.password,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { register, isSubmitting };
}
