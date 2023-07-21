import React from 'react';
import { FieldError } from 'react-hook-form';

export const ErrorMessage = React.memo(({ error }: { error?: FieldError }) =>
  error ? (
    <p className="text-red-500 text-xs italic text-red-500 mt-1">
      {error?.message}
    </p>
  ) : (
    <></>
  )
);
