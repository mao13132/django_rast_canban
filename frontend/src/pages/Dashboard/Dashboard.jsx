import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../../services/api';
import Header from '../../components/Header';
import TaskColumn from '../../components/Task/TaskColumn';
import TaskForm from '../../components/Task/TaskForm';
import SearchBar from '../../components/UI/SearchBar';
import { useTaskForm } from '../../context/TaskFormContext';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { openCreateForm } = useTaskForm();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await tasksAPI.getTasks();
      setTasks(response.data);
    } catch (err) {
      setError('Ошибка при загрузке задач');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await tasksAPI.createTask(taskData);
      fetchTasks();
    } catch (err) {
      setError('Ошибка при создании задачи');
      console.error(err);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await tasksAPI.updateTask(taskId, taskData);
      fetchTasks();
    } catch (err) {
      setError('Ошибка при обновлении задачи');
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await tasksAPI.deleteTask(taskId);
      fetchTasks();
    } catch (err) {
      setError('Ошибка при удалении задачи');
      console.error(err);
    }
  };

  const filterTasks = (status) => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
      return task.status === status && matchesSearch;
    });
  };

  if (loading) return (
    <>
      <Header />
      <div className={styles.loading}>Загрузка...</div>
    </>
  );
  
  if (error) return (
    <>
      <Header />
      <div className={styles.error}>{error}</div>
    </>
  );

  return (
    <div className={styles.dashboardContainer}>
      <Header />
      <main className={styles.dashboard}>
        <div className={styles.header}>
          <h1>Доска задач</h1>
          <div className={styles.actions}>
            <SearchBar 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск задач"
            />
            <button 
              className={styles.createButton}
              onClick={openCreateForm}
            >
              Создать
            </button>
            <button className={styles.menuButton}>☰</button>
          </div>
        </div>

        <div className={styles.subHeader}>
          <span>Заметки</span>
          <span>Архив заметок</span>
        </div>

        <div className={styles.kanbanBoard}>
          <TaskColumn
            title="Сделать"
            tasks={filterTasks('todo')}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="В работе"
            tasks={filterTasks('in_progress')}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="Сделано"
            tasks={filterTasks('done')}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="Завершено"
            tasks={filterTasks('completed')}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>

        <TaskForm onSubmit={handleCreateTask} />
      </main>
    </div>
  );
};

export default Dashboard; 