/**
 * DTO (Data Transfer Object) для пользователя
 * Соответствует модели User из бэкенда
 */
class UserDTO {
    /**
     * @param {Object} data - Данные пользователя
     * @param {string} data.email - Email пользователя
     * @param {string} [data.first_name] - Имя пользователя
     * @param {string} [data.last_name] - Фамилия пользователя
     * @param {string} [data.avatar] - URL аватара пользователя
     * @param {Date} [data.date_joined] - Дата регистрации
     */
    constructor(data) {
        this.email = data.email;
        this.firstName = data.first_name || '';
        this.lastName = data.last_name || '';
        this.avatar = data.avatar || null;
        this.dateJoined = data.date_joined ? new Date(data.date_joined) : null;
    }

    /**
     * Получить полное имя пользователя
     * @returns {string} Полное имя или email, если имя не указано
     */
    get fullName() {
        if (this.firstName || this.lastName) {
            return `${this.firstName} ${this.lastName}`.trim();
        }
        return this.email;
    }

    /**
     * Получить инициалы пользователя
     * @returns {string} Инициалы или первую букву email
     */
    get initials() {
        if (this.firstName && this.lastName) {
            return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
        }
        return this.email[0].toUpperCase();
    }

    /**
     * Преобразовать DTO в объект для отправки на сервер
     * @returns {Object} Объект в формате API
     */
    toAPI() {
        return {
            email: this.email,
            first_name: this.firstName,
            last_name: this.lastName,
            avatar: this.avatar
        };
    }

    /**
     * Создать DTO из данных API
     * @param {Object} data - Данные от API
     * @returns {UserDTO} Новый экземпляр DTO
     */
    static fromAPI(data) {
        return new UserDTO(data);
    }
}

export default UserDTO; 