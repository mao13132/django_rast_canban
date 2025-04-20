import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
    updateTaskStatus,
    fetchCategories,
    fetchStatuses,
    statuses
  } = useTask();

  const { openCreateForm } = useTaskForm();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Загрузка начальных данных
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetchTasks(),
          fetchCategories(),
          fetchStatuses()
        ]);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
      }
    };

    loadInitialData();
  }, []);

  // Дебаунс для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Мемоизированная фильтрация задач
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (!task || !task.status) return false;
      
      // Фильтрация по поисковому запросу
      if (debouncedSearch) {
        const searchLower = debouncedSearch.toLowerCase();
        const matchesSearch = 
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      return true;
    });
  }, [tasks, debouncedSearch]);

  // Мемоизированное распределение задач по статусам
  const tasksByStatus = useMemo(() => {
    const result = {};
    statuses.forEach(status => {
      result[status.id] = filteredTasks.filter(task => task.status.id === status.id);
    });
    return result;
  }, [filteredTasks, statuses]);

  // Мемоизированные обработчики
  const handleCreateTask = useCallback(async (taskData) => {
    try {
      await createTask(taskData);
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
    }
  }, [createTask]);

  const handleUpdateTask = useCallback(async (taskId, taskData) => {
    try {
      await updateTask(taskId, taskData);
    } catch (err) {
      console.error('Ошибка при обновлении задачи:', err);
    }
  }, [updateTask]);

  const handleDeleteTask = useCallback(async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (err) {
      console.error('Ошибка при удалении задачи:', err);
    }
  }, [deleteTask]);

  const handleUpdateTaskStatus = useCallback(async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи:', err);
    }
  }, [updateTaskStatus]);

  // Мемоизированный рендеринг колонок
  const renderColumns = useMemo(() => {
    return statuses.map(status => (
      <TaskColumn
        key={status.id}
        title={status.name}
        tasks={tasksByStatus[status.id] || []}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onUpdateStatus={handleUpdateTaskStatus}
      />
    ));
  }, [statuses, tasksByStatus, handleUpdateTask, handleDeleteTask, handleUpdateTaskStatus]);

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
          {renderColumns}
        </div>

        <TaskFormWrapper onSubmit={handleCreateTask} />
      </main>
    </div>
  );
};

export default Dashboard; 