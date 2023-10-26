import React from "react";

const TaskForm = (props) => {
  const { name, createTask, handleInputChange, isEditing, updateTask } = props;

  return (
    <div>
      <form
        className="task-form"
        onSubmit={isEditing ? updateTask : createTask}
      >
        {/* name is formData property */}
        <input
          type="text"
          placeholder="Add a Task"
          name="name"
          value={name}
          onChange={handleInputChange}
        />{" "}
        <button type="submit">{isEditing ? "Edit" : "Add"}</button>
      </form>
    </div>
  );
};

export default TaskForm;
