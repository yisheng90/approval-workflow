import {Program} from '../models/program'

export const getAllPrograms = async (req, res) => {
    try {
        const programs = await Program.find({})

        res.status(200).json({
            data: programs.map((program) => {
                return {
                    title: program.title,
                    _id: program._id,
                    status: program.status,
                    transitions: program.transitions()
                }
            })
        })
    } catch (err) {
        res.status(500).json(err)
    }
}

export const createProgram = async (req, res) => {
    try {

        const program = new Program()
        program.title = req.body.title
        program.status = req.body.status
        await program.save()

        res.status(200).json({
            data: {
                _id: program.id
            }
        })

    } catch (err) {
        res.status(500).json(err)
    }
}

export const approveProgram = async (req, res) => {
    try {

        const program = await Program.findOne({_id: req.params.id})

        res.status(200).json({
            data: {
                success: program.approve()
            }
        })

    } catch (err) {
        res.status(500).json(err)
    }
}

export const rejectProgram = async (req, res) => {
    try {

        const program = await Program.findOne({_id: req.params.id})

        res.status(200).json({
            data: {
                success: program.reject()
            }
        })

    } catch (err) {
        res.status(500).json(err)
    }
}

export const holdProgram = async (req, res) => {
    try {

        const program = await Program.findOne({_id: req.params.id})

        res.status(200).json({
            data: {
                success: program.hold()
            }
        })

    } catch (err) {
        res.status(500).json(err)
    }
}

export const deleteProgram = async (req, res) => {
    try {

        const program = await Program.findOne({_id: req.params.id})
        program.remove()

        res.status(200).json({
            data: {
                success: true
            }
        })

    } catch (err) {
        res.status(500).json(err)
    }
}


