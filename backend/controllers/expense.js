const ExpenseSchema = require("../models/expenseModel")


exports.addExpense = async (req, res) => {
    const {title, amount, category, description, repeated, date} = req.body

    const expense = ExpenseSchema({
    title,
    amount,
    category,
    description,
    repeated,
    date
    })
    console.log(expense)

    try{
        //validations
        if(!title || !category || !date) {
            return res.status(400).json({message: 'Title, Category and Date is required'})
        }
        if(amount <= 0 || !amount === 'number') {
            return res.status(400).json({message: 'Amount must be a positive number'})
        }
        await expense.save()
        res.status(200).json({message: 'Expense added'})
    } catch (error) {
        return res.status(500).json({message: 'Server error'})
    }
}


exports.getExpenses = async (req, res) => {
    try{
        const expenses = await ExpenseSchema.find().sort({createdAt: -1})
        res.status(200).json(expenses)
    } catch (error) {
        res.status(500).json({message: 'Server error'})
    }
}

exports.deleteExpense = async (req, res) => {
    const {id} = req.params;
    ExpenseSchema.findByIdAndDelete(id)
    .then((expense) => {
        res.status(200).json({message: 'Expense has been deleted'})
    })
    .catch((err) => {
        res.status(500).json({message: 'Server error'})
    })
}
