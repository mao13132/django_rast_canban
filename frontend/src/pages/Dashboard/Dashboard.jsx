import React, { useEffect, useMemo, useCallback } from 'react';
import { useTaskStore } from '../../store/taskStore';
import Header from '../../components/Header/Header';
import TaskColumn from '../../components/Task/TaskColumn';
import TaskForm from '../../components/Task/TaskForm';
import EditTaskForm from '../../components/Task/EditTaskForm';
import SubHeader from '../../components/SubHeader/SubHeader';
import TaskControls from '../../components/TaskControls/TaskControls';
import styles from './Dashboard.module.css';
import SearchBar from '../../components/UI/SearchBar';
import { useNotification } from '../../context/NotificationContext';
import { useTaskSearch } from '../../context/TaskSearchContext';

const Dashboard = () => {
  const {
    tasks,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    fetchCategories,
    fetchStatuses,
    statuses,
    sortBy
  } = useTaskStore();

  const { showNotification } = useNotification();
  const { searchQuery, setSearchQuery, filterTasks } = useTaskSearch();

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

  // Мемоизированная фильтрация задач
  const filteredTasks = useMemo(() => {
    return filterTasks(tasks);
  }, [tasks, filterTasks]);

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
            title="Доска задач"
            navLinks={[
              { label: 'Заметки', path: '/notes', isActive: true },
              { label: 'Архив заметок', path: '/archive' },
              { label: 'Хранилище', path: '/files' }
            ]}
            rightComponent={<TaskControls />}
          />

          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Поиск задач'
          />

          <div className={styles.kanbanBoard}>
            {renderColumns}
          </div>
        </div>

        <TaskForm />
        <EditTaskForm />
      </main>
    </div>
  );
};

export default Dashboard; 