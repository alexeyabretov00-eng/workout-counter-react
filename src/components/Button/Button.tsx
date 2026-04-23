import { Button as AntButton, type ButtonProps } from 'antd';

export const Button: React.FC<ButtonProps & { ariaLabel?: string }> = ({
  children,
  ariaLabel,
  ...props
}) => {
  return (
    <AntButton htmlType="button" aria-label={ariaLabel} {...props}>
      {children}
    </AntButton>
  );
};
