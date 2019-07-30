const express = require('express');
const router = express.Router();

router.get('/:pin', (req, res) => {
    const pin = req.params.pin;
    const regex = /^[0-9]*$/;

    // Validation checks
    if (pin.length !== 5) {
        res.status(422).json({
            message: `${pin} is not a valid game pin. It has to be 5 integers long.`,
            length: pin.length
        });
        return;
    } else if (!pin.match(regex)) {
        res.status(422).json({
            message: `${pin} is not a valid game pin. It should only contain integers.`,
            length: pin.length
        });
        return;
    }

    // Query database...

    // Temporary (Tester for if game pin not found)
    if (pin === "12345") {
        res.status(404).json({
            message: `Game with a pin of ${pin} was not found.`,
            length: pin.length
        });
        return;
    }

    // Send response with game questions & choices
    res.status(200).json({
        message: 'Join successful.',
        length: pin.length
    });
});

module.exports = router;
