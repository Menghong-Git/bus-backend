import { IsString, IsNumber, IsEnum } from 'class-validator';
import { PaymentMethod } from 'src/common/enums/payment-method.enum';


export class CreatePaymentDto {
  @IsString()
  bookingId: string;

  @IsNumber()
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsString()
  token?: string; // For Stripe
}
