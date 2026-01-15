import { ButtonHTMLAttributes } from 'react';

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  return <button {...rest} className={`rounded bg-black px-4 py-2 text-white ${className ?? ''}`} />;
}


