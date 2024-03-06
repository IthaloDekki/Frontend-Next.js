"use client"

import React, { useEffect, useState } from "react";

import { Task } from "./task"; //Interface de tasks as is in the backend with NestJS

const getDone = (tasks: Task[]) => {
    return tasks.filter(task => task.checked)
}

const getPending = (tasks: Task[]) => {
    return tasks.filter(task => !task.checked)
}


export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [idCounter, setIdCounter] = useState(0)
    const [progress, setProgress] = useState(0)
    const [filter , setFilter] = useState('all')
 
    const addTask = (taskText: string) => {
     const newTask = new Task(idCounter, taskText, false, 0)
     setTasks((prevTasks) => [...prevTasks, newTask])
     setIdCounter(idCounter + 1)
    }
 
    const changeProcess = () => {
     const completedTasks = tasks.filter(task => task.checked).length
     const totalTask = tasks.length
     const percentage = totalTask > 0 ? (completedTasks / totalTask) * 100 : 0
     setProgress(percentage)
    }
    const statusChange = (taskId: number) => {
      setTasks((tasks) => 
        tasks.map((task) =>
          task.id === taskId ? { ...task, checked: !task.checked } : task
        )
      );
    };
    const filterTasks = () => {
      switch (filter) {
        case "pending":
          return getPending(tasks);
        case "done":
          return getDone(tasks);
        default:
          return tasks;
      }
    }

    const deleteDone = () => {
      setTasks(getPending(tasks))
    };
    
    useEffect(() => {
      changeProcess()
    }, [tasks]);

   return (
    <div className=" h-screen flex items-center justify-center ">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
         <h1 className="text-red-400 text-4xl">TO-DO LIST</h1>
         <div className="p-5 border-2 border-red-400 rounded">
            <AddTask onAddTask={addTask}/>
            <ProgressBar percentage={progress}/>
            <ListTasks OnStatusChange={statusChange} tasks={filterTasks()}/>
            <hr className="h-px my-8 bg-red-200 border-0 dark:bg-red-400"></hr>
            <OptionsLine tasks={tasks} filter={filter} OnFilterChange={setFilter} OnDeleteDone={deleteDone}/>
         </div>
      </form>
    </div>
   );
}


function AddTask({ onAddTask }: {onAddTask: (taskText: string) => void}){
  const [taskText, setTaskText] = useState('')

  const handleAdd = () =>{
    if (taskText.trim() !== ''){
      onAddTask(taskText)
      setTaskText('')
    }
  }

  return (
    <div className="w-12/12 flex space-x-4 text-xl">
      <input onChange={(e) => setTaskText(e.target.value)} value={taskText} className="shadow appearance-none border rounded w-64 py-2 px-3 text-red-500 leading-tight focus:outline-none focus:shadow-outline" id="task" type="text" placeholder="Sou uma tarefa:)"/>
      <button onClick={handleAdd} className="bg-red-400  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2">Enter</button>
    </div>
    
  )
}

function ProgressBar({percentage}: {percentage: number}){
    return(
      <>
        <div className="w-full mt-2 bg-red-500 rounded-full h-1.5 mb-4 dark:bg-red-400">
          <div style= {{width: `${percentage}%`}} className={`bg-red-400 h-1.5 rounded-full dark:bg-red-500`}></div>
        </div>
      </>
    )
}

function AddedTask({task, OnStatusChange}: {OnStatusChange: (taskId: number) => void; task: Task}){
  return(
    <div className="w-12/12 flex items-center space-x-2">
      <input onChange={(e) => OnStatusChange(task.id)} 
      type="checkbox" checked={task.checked} className="w-6 h-6 text-white-600 bg-gray-100 border-red-300 rounded focus:ring-red-500 dark:focus:ring-red-800 dark:ring-offset-red-800 focus:ring-2 dark:bg-red-400 dark:border-red-400"/>
      <label className="text-xl font-medium text-white">{task.text}</label>
    </div>
  )
}


function ListTasks({ tasks, OnStatusChange}: {OnStatusChange: (taskId:number) => void; tasks: Task[]}){
  const listTasks = tasks.map(task =>
    <AddedTask key={task.id} OnStatusChange={OnStatusChange} task={task}/>
  )
  return (
    <>
      {listTasks}
    </>
  )
}

function OptionsLine({ tasks, filter, OnFilterChange, OnDeleteDone }: { tasks: Task[]; filter: string; OnFilterChange: (filter: string) => void; OnDeleteDone: () => void}) {
  

  return (
    <div className="w-12/12 flex items-center justify-center space-x-12">
      <p>Tasks pending: {getPending(tasks).length}</p>
      <button onClick={() => OnFilterChange("all")} className={`${
        filter === "all" ? 'border-b-2 border-red-400 text-red-200' : ''
      }`}>All</button>
      <button onClick={() => OnFilterChange("pending")} className={`${
        filter === "pending" ? 'border-b-2 border-red-400 text-red-200' : ''
      }`}>Pending</button>
      <button onClick={() => OnFilterChange("done")} className={`${
        filter === "done" ? 'border-b-2 border-red-400 text-red-200' : ''
      }`}>Done</button>
      <button onClick={() => OnDeleteDone()} className="px-4 cursor-pointer border-2 border-red-400 rounded text-red-200">Clean Completed</button>
  </div>
  );
};