import stripe
from app.core.config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeService:
    @staticmethod
    def create_payment_intent(amount_cents: int, currency: str = "usd", metadata: dict = None):
        """Create a one-time payment intent"""
        try:
            intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency=currency,
                metadata=metadata or {},
                automatic_payment_methods={"enabled": True},
            )
            return intent
        except stripe.error.StripeError as e:
            print(f"Stripe error: {e}")
            return None

    @staticmethod
    def create_subscription(customer_id: str, price_id: str, metadata: dict = None):
        """Create a recurring subscription with an incomplete first payment"""
        try:
            subscription = stripe.Subscription.create(
                customer=customer_id,
                items=[{"price": price_id}],
                metadata=metadata or {},
                payment_behavior="default_incomplete",
                payment_settings={"save_default_payment_method": "on_subscription"},
                expand=["latest_invoice.payment_intent"],
            )
            return subscription
        except stripe.error.StripeError as e:
            print(f"Stripe error: {e}")
            return None

    @staticmethod
    def retrieve_payment_intent(payment_intent_id: str):
        """Retrieve a payment intent from Stripe"""
        try:
            return stripe.PaymentIntent.retrieve(payment_intent_id)
        except stripe.error.StripeError as e:
            print(f"Stripe error: {e}")
            return None

    @staticmethod
    def create_customer(email: str, name: str = None):
        """Create a Stripe customer"""
        try:
            customer = stripe.Customer.create(
                email=email,
                name=name,
            )
            return customer
        except stripe.error.StripeError as e:
            print(f"Stripe error: {e}")
            return None

    @staticmethod
    def create_price(amount_cents: int, currency: str = "usd", recurring: bool = False):
        """Create a price for recurring donations"""
        try:
            price_data = {
                "unit_amount": amount_cents,
                "currency": currency,
                "product_data": {
                    "name": "Monthly Donation" if recurring else "One-time Donation",
                },
            }
            if recurring:
                price_data["recurring"] = {"interval": "month"}
            
            price = stripe.Price.create(**price_data)
            return price
        except stripe.error.StripeError as e:
            print(f"Stripe error: {e}")
            return None

    @staticmethod
    def verify_webhook_signature(payload: bytes, sig_header: str):
        """Verify Stripe webhook signature"""
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
            return event
        except ValueError:
            return None
        except stripe.error.SignatureVerificationError:
            return None


stripe_service = StripeService()

