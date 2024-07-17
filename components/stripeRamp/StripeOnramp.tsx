import {loadStripeOnramp} from "@stripe/crypto";
import { CryptoElements, OnrampElement } from "./StripeCryptoElements";



const stripeOnrampPromise = loadStripeOnramp(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

interface StripeOnrampProps {
  clientSecret: string
}
export default function StripeOnramp ({ clientSecret } : StripeOnrampProps) {
  // IMPORTANT: replace with your logic of how to mint/retrieve client secret
  

  const appearance = {
    theme: "light"
  }

  return (
    <CryptoElements stripeOnramp={stripeOnrampPromise}>
      <OnrampElement clientSecret={clientSecret} appearance={appearance}/>
    </CryptoElements>
  );
}