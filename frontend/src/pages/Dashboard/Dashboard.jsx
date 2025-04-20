import React, { useEffect, useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { useTaskForm } from '../../context/TaskFormContext';
import Header from '../../components/Header';
import TaskColumn from '../../components/Task/TaskColumn';
import TaskFormWrapper from '../../components/Task/TaskForm/TaskFormWrapper';
import SearchBar from '../../components/UI/SearchBar';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus
  } = useTask();

  const { openCreateForm } = useTaskForm();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Дебаунс для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Загрузка задач при изменении поискового запроса
  useEffect(() => {
    const params = {};
    if (debouncedSearch) {
      params.search = debouncedSearch;
    }
    fetchTasks(params);
  }, [debouncedSearch, fetchTasks]);

  // Фильтрация задач по статусу
  const filterTasks = (status) => {
    return tasks.filter(task => task.status === status);
  };

  // Обработчики для задач
  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await updateTask(taskId, taskData);
    } catch (err) {
      console.error('Ошибка при обновлении задачи:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (err) {
      console.error('Ошибка при удалении задачи:', err);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи:', err);
    }
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
            onUpdateStatus={handleUpdateTaskStatus}
          />
          <TaskColumn
            title="В работе"
            tasks={filterTasks('in_progress')}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onUpdateStatus={handleUpdateTaskStatus}
          />
          <TaskColumn
            title="Сделано"
            tasks={filterTasks('done')}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onUpdateStatus={handleUpdateTaskStatus}
          />
          <TaskColumn
            title="Завершено"
            tasks={filterTasks('completed')}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onUpdateStatus={handleUpdateTaskStatus}
          />
        </div>

        <TaskFormWrapper onSubmit={handleCreateTask} />
      </main>
    </div>
  );
};

export default Dashboard; 