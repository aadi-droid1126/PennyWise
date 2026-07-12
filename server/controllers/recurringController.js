const Recurring = require("../models/Recurring");

// @GET /api/recurring
const getRecurring = async (req, res) => {
  try {
    const rituals = await Recurring.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(rituals);
  } catch (err) {
    res
      .status(500)
      .json({ message: "IT rejected the ritual.", error: err.message });
  }
};

// @POST /api/recurring
const createRecurring = async (req, res) => {
  try {
    const { type, title, amount, category, frequency, startDate } = req.body;

    if (!type || !title || !amount || !category || !frequency || !startDate) {
      return res
        .status(400)
        .json({ message: "IT rejected the ritual. Fill every field." });
    }

    const ritual = await Recurring.create({
      userId: req.user.id,
      type,
      title,
      amount,
      category,
      frequency,
      startDate,
    });

    res
      .status(201)
      .json({ message: "The ritual is bound. IT never forgets. 🎈", ritual });
  } catch (err) {
    res
      .status(500)
      .json({ message: "IT rejected the ritual.", error: err.message });
  }
};

// @PUT /api/recurring/:id
const updateRecurring = async (req, res) => {
  try {
    const ritual = await Recurring.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true },
    );

    if (!ritual)
      return res.status(404).json({ message: "Ritual not found." });

    res.json({ message: "Ritual updated.", ritual });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update ritual.", error: err.message });
  }
};

// @DELETE /api/recurring/:id
const deleteRecurring = async (req, res) => {
  try {
    const ritual = await Recurring.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!ritual)
      return res.status(404).json({ message: "Ritual not found." });

    res.json({ message: "The ritual is broken. IT is displeased." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete ritual.", error: err.message });
  }
};

module.exports = {
  getRecurring,
  createRecurring,
  updateRecurring,
  deleteRecurring,
};
