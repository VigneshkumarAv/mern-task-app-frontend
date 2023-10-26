import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TaskForm from "./TaskForm";
import Task from "./Task";
import axios from "axios";
import { URL } from "../App";
import loaderImg from "../assets/loader.gif";

const TaskList = (props) => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [taskID, setTaskID] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    completed: false,
  });
  const { name } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getTasks = async () => {
    setIsLoading(true);
    try {
      const {data} = await axios.get(`${URL}/api/tasks`);
      console.log(data);
      setTasks(data);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (name === "") {
      return toast.error("Input field cannot be empty");
    }
    try {
      await axios.post(`${URL}/api/tasks`, formData);
      toast.success("Task added successfully");
      setFormData({ ...formData, name: "" });
      getTasks();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`);
      getTasks();
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getSingleTask = async(task) => {
    setFormData({name: task.name,completed: false}) //editing flow
    setTaskID(task._id);
    setIsEditing(true);
  }

  const updateTask = async(e) => {
    e.preventDefault();
    
    try {
      await axios.put(`${URL}/api/tasks/${taskID}`, formData);
      setFormData({...formData,name: ""})
      setIsEditing(false);
      getTasks();
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error(error.message);
    }
  }

  const setToComplete = async (task) => {
     const newFormData = {
      name: task.name,
      completed: true
     }
     try {
      await axios.put(`${URL}/api/tasks/${task._id}`, newFormData);
      getTasks();
     } catch (error) {
      toast.error(error.message);
     }
  }

  useEffect(() => {
    getTasks();
  }, [])

  useEffect(() => {
    const cTask = tasks.filter((task)=> {
      return task.completed === true
    })
    setCompletedTasks(cTask); 
  }, [tasks])
  
  
  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm
        name={name}
        createTask={createTask}
        handleInputChange={handleInputChange}
        isEditing={isEditing}
        updateTask={updateTask}
      />
      <div className="--flex-between --pb">
        <p>
          <b>Total Tasks:</b> {
            tasks.length
          }
        </p>
        <p>
          <b>Completed Tasks:</b> 
          {completedTasks.length}
        </p>
      </div>
      <hr />
      {isLoading ? (
        <div className="--flex-center">
          <img src={loaderImg} alt="loading" />
        </div>
      ) : tasks.length === 0 ? (
        <p className="--py">No task added. Please add a task.</p>
      ) : (
        <>
        {
        tasks.map((task,index)=> {
          return <Task task={task} key={task._id} index={index} 
          deleteTask={deleteTask} getSingleTask={getSingleTask} 
          setToComplete={setToComplete}
          />;
          
        })
        }
        
        </>
      )}
    </div>
  );
};

export default TaskList;
