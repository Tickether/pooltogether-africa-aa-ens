
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3'

export default function Deposit() {
    const config = {
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_KEY,
        tx_ref: '0',
        amount: 1,
        currency: 'GHS',
        payment_options: 'mobilemoney',
        customer: {
            email: 'tickether@gmail.com',
            phone_number: '233531616924',
            name: 'john doe',
        },
        customizations: {
            title: 'PoolTogether Africa',
            description: 'Payment for items in cart',
            logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
        },
    }
    const handleFlutterPayment = useFlutterwave(config)
    const doLocalPay = () => {
        handleFlutterPayment({
            callback: (response) => {
                console.log(response)
                closePaymentModal() // this will close the modal programmatically
            },
            onClose: () => {},
        })
    }
    return(
        <>
            <main>
                <button onClick={doLocalPay}>Save to Susu</button>
            </main>
        </>
    )
}