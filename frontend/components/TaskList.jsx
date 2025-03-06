import React, { useEffect, useState } from "react";
import axios from "axios";
import {AnimatePresence, motion} from "framer-motion";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks from the backend
  useEffect(() => {
    axios.get("http://localhost:5000/tasks")
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error fetching tasks:", error));
  }, []);

  // Add a new task
  const addTask = () => {
    if (!newTask.trim()) return;
    axios.post("http://localhost:5000/tasks", { title: newTask, completed: false })
      .then(response => setTasks([...tasks, response.data]))
      .catch(error => console.error("Error adding task:", error));
    setNewTask("");
  };

  // Toggle task completion
  const toggleTask = (id, completed) => {
    axios.put(`http://localhost:5000/tasks/${id}`, { completed: !completed })
      .then(response => {
        setTasks(tasks.map(task => task._id === id ? response.data : task));
      })
      .catch(error => console.error("Error updating task:", error));
  };

  // Delete a task
  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task._id !== id));
      })
      .catch(error => console.error("Error deleting task:", error));
  };

  return (
    <div className="dark:bg-gray-100 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg space-y-4 w-full md:w-1/2">
      <h1 className="text-xl font-bold text-center ">🎯 To-Do List</h1>
      <div className="flex gap-10">
      <input 
        className=" border border-gray-300 rounded-lg p-2 flex-grow"
        type="text" 
        value={newTask} 
        onChange={(e) => setNewTask(e.target.value)} 
        placeholder="Add a new task"
      />
      <button className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300"onClick={addTask}>Add</button>
      </div>
      <ul className="space-y-2">
        <AnimatePresence>
        {tasks.map(task => (
          <motion.li
          initial={{opacity:0,y:-10}}
          animate={{opacity:1,y:0}}
          exit={{opacity:0,x:-20}}
          transition={{duration:0.3}} 
          className="flex justify-between items-center p-3 bg-gray-100 rounded" key={task._id}>
            <span 
              style={{ textDecoration: task.completed ? "line-through" : "none", cursor: "pointer" }}
              onClick={() => toggleTask(task._id, task.completed)}
            >
              {task.title}
            </span>
            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded " onClick={() => deleteTask(task._id)}>Delete</button>
          </motion.li>
        ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default TaskList;