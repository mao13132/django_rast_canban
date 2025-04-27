import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskForm } from '../../context/TaskFormContext';
import { useFilter } from '../../context/FilterContext';
import { useTaskStore } from '../../store/taskStore';
import Header from '../../components/Header/Header';
import TaskColumn from '../../components/Task/TaskColumn';
import TaskForm from '../../components/Task/TaskForm';
import Filter from '../../components/Filter/Filter';
import SearchBar from '../../components/UI/SearchBar';
import SubHeader from '../../components/SubHeader/SubHeader';
import styles from './Dashboard.module.css';
import { useNotification } from '../../context/NotificationContext';

const Dashboard = () => {
  const navigate = useNavigate();
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
    statuses,
    setFilters,
    sortBy
  } = useTaskStore();

  const { showNotification } = useNotification();
  const { openCreateForm } = useTaskForm();
  const { toggleFilter } = useFilter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);

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
  }, [fetchTasks, fetchCategories, fetchStatuses]);

  // Дебаунс для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setFilters({ search: searchQuery });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, setFilters]);

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

    // Сортируем задачи если выбраны критерии сортировки
    let sortedTasks = [...filteredTasks];
    if (sortBy.length > 0) {
      sortedTasks.sort((a, b) => {
        // Проходим по всем выбранным критериям сортировки
        for (const criterion of sortBy) {
          let comparison = 0;

          switch (criterion) {
            case 'name':
              comparison = a.title.localeCompare(b.title);
              break;
            case 'priority':
              const priorityOrder = { high: 3, medium: 2, low: 1 };
              comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
              break;
            case 'status':
              comparison = a.status.order - b.status.order;
              break;
            default:
              comparison = 0;
          }

          // Если текущий критерий дал неравенство, возвращаем его результат
          if (comparison !== 0) return comparison;
        }
        return 0; // Если все критерии дали равенство
      });
    }

    // Сортируем статусы по полю order
    const sortedStatuses = [...statuses].sort((a, b) => a.order - b.order);

    sortedStatuses.forEach(status => {
      result[status.id] = sortedTasks.filter(task => task.status?.id === status.id);
    });
    return result;
  }, [filteredTasks, statuses, sortBy]);

  // Мемоизированные обработчики
  const handleCreateTask = useCallback(async (taskData) => {
    try {
      await createTask(taskData);
      showNotification('Задача успешно создана', 'success');
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
      showNotification('Ошибка при создании задачи', 'error');
    }
  }, [createTask, showNotification]);

  const handleUpdateTask = useCallback(async (taskId, taskData) => {
    try {
      await updateTask(taskId, taskData);
      showNotification('Задача успешно обновлена', 'success');
    } catch (err) {
      console.error('Ошибка при обновлении задачи:', err);
      showNotification('Ошибка при обновлении задачи', 'error');
    }
  }, [updateTask, showNotification]);

  const handleDeleteTask = useCallback(async (taskId) => {
    try {
      await deleteTask(taskId);
      showNotification('Задача успешно удалена', 'success');
    } catch (err) {
      console.error('Ошибка при удалении задачи:', err);
      showNotification('Ошибка при удалении задачи', 'error');
    }
  }, [deleteTask, showNotification]);

  const handleUpdateTaskStatus = useCallback(async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      showNotification('Статус задачи обновлен', 'success');
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи:', err);
      showNotification('Ошибка при обновлении статуса задачи', 'error');
    }
  }, [updateTaskStatus, showNotification]);

  // Мемоизированный рендеринг колонок
  const renderColumns = useMemo(() => {
    // Сортируем статусы по полю order
    const sortedStatuses = [...statuses].sort((a, b) => a.order - b.order);

    return sortedStatuses.map(status => (
      <TaskColumn
        key={status.id}
        title={status.name}
        tasks={tasksByStatus[status.id] || []}
        color={status.color}
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
    <div className={styles.container}>
      <main className={styles.main}>
        <Header
          navigationLinks={[
            { label: 'Заметки', path: '/notes' },
            { label: 'Архив заметок', path: '/archive' },
            { label: 'Файлы', path: '/files' }
          ]}
        />

        <div className={styles.contentWrapper}>
          
          <SubHeader 
            title="Заметки"
            navLinks={[
              { label: 'Заметки', path: '/notes', isActive: true },
              { label: 'Архив заметок', path: '/archive' },
              { label: 'Хранилище', path: '/files' }
            ]}
           />

          <div>
            <SearchBar
              value=""
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Поиск задач'
            />
            <>
              <button
                className={styles.createButton}
                onClick={openCreateForm}
              >
                Создать
              </button>
              <div className={styles.menuContainer}>
                <button
                  className={styles.menuButton}
                  onClick={toggleFilter}
                >
                  ☰
                </button>
                <Filter />
              </div>
            </>
          </div>

          <div className={styles.kanbanBoard}>
            {renderColumns}
          </div>

        </div>

        <TaskForm />
      </main>
    </div>
  );
};

export default Dashboard; 