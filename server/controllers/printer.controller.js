import Order from '.././models/order.model.js'

export const postPrintOrder = async (req, res) => {
    const { fileLink, userId, vendorId, comments } = req.body;

    try {
        if (!fileLink || !userId || !vendorId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newOrder = new Order({
            pdfLink: fileLink,
            userId: userId,
            shopId: vendorId,
            orderStatus: "Pending",
            comments: comments,
            orderTotal: 5,
            prePayment: false,
            deliveryPersonId: userId,
        });

        await newOrder.save();

        res.status(201).json({ message: 'Print order posted successfully', order: { fileLink, userId, vendorId, comments } });
    } catch (error) {
        console.error("Error sending print request:", error);
        res.status(500).json({ message: "Error sending print request. Please try again." });
    }
};

