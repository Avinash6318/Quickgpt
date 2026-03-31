
import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const stripeWebhooks = async(request,response)=>{
    const stripe = new Stripe(process.env.STRIPE_WEBHOOK_SECRET);
    const sign = request.headers["stripe-signature"];
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            request.body, sign,process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error) {
        return response.status(401).send(`webhook eroor :${error.message}`)    
    }

    try {
       switch (event.type) {
            case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            const sessionList = await stripe.checkout.sessions.list({
                    payment_intent: paymentIntent.id,});

            const session = sessionList.data[0];
            const { transactionId, appId } = session.metadata;

            if (appId === "quickcart") {
                const transaction = await Transaction.findOne({
                _id: transactionId,
                isPaid: false,
                });

                    // update credits in user account
                    await User.updateOne(
                    { _id: transaction.userId },
                    { $inc: { credits: transaction.credits } }
                    );

                // update credit payment status
                    transaction.isPaid = true;
                    await transaction.save();
                }
            else {
                    return response.json({
                    received: true,
                    message: "Ignored event: Invalid app"})
                }
            break;
            }
            
            default:
                console.log("unhandled event type :", event.type);
                break;
        }
        response.status(201).json({received: true})
    } catch (error) {
        console.error("webhook processing error :", error)
        return response.status(401).send(`interval server error`)    
    }


}