import Order from '.././models/order.model.js'

export const postPrintOrder = (req, res) => {
    const { fileLink, userId, vendorId, comments } = req.body;

    if (!fileLink || !userId || !vendorId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const newOrder = new Order({
        pdfLink: fileLink,
        userId: userId,
        shopId: vendorId,
        orderStatus: "Pending",
        comments: comments,
        orderTotal: 5
    });

    newOrder.save()
        .then(order => res.status(201).json(order))
        .catch(err => res.status(500).json({ message: 'Error saving order', error: err }));

    res.status(201).json({ message: 'Print order posted successfully', order: { fileLink, userId, vendorId, comments } });
};

