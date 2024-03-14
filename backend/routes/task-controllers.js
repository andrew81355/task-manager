import  {Router} from "express"

const router = Router();

const tasks = [{ id: 1, title: "Update User Profile", description: "Update user profile information with new data", status: "open" },
                { id: 2, title: "Implement Login Authentication", description: "Implement authentication mechanism for user login", status: "in progress" },
                { id: 3, title: "Design Landing Page", description: "Create the layout and design for the landing page", status: "done" },
                { id: 4, title: "Fix Bug in Payment Gateway", description: "Identify and fix the bug causing issues in the payment gateway", status: "open" },
                { id: 5, title: "Refactor Database Schema", description: "Optimize and refactor the database schema for better performance", status: "in progress" },
                { id: 6, title: "Deploy Application to Production", description: "Deploy the application to production server for public access", status: "done" },
                { id: 7, title: "Write Unit Tests for User Module", description: "Write unit tests to ensure functionality of user module", status: "open" },
                { id: 8, title: "Optimize Page Load Time", description: "Optimize website to reduce page load time and improve user experience", status: "in progress" },
                { id: 9, title: "Create API Documentation", description: "Document the APIs with clear instructions and examples", status: "done" },
                { id: 10, title: "Implement Forgot Password Feature", description: "Implement feature to allow users to reset their passwords", status: "open" }
];

router.get("/", (req, res) => {
    return res.json(tasks);
});

router.get('/:id', (req, res) => {
    const showTask = tasks.find((item) => item.id === parseInt(req.params.id));
    return res.json(showTask);
});

router.post('/', (req, res) => {
    const newTask = req.body;
    const TaskId = tasks.length + 1;

    tasks.push({id: TaskId, ...newTask});
    res.status(201).json(newTask);
});

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(todo => todo.id === id);

    if (index === -1) {
        res.status(404).json({message: "Not Found"});
    }

    const {title , description, status} = req.body

    tasks[index] = {id: tasks[index].id, title, description, status};
    
    return res.status(200).json(tasks[id])

});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(todo => todo.id === id);

    if (index === -1) {
        res.status(404).json({message: "Not Found"});
    }

    tasks.splice(index, 1);
    res.json({ message: 'Task deleted successfully' });
}); 



export default router;