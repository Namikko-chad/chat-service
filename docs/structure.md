# Module structure
- entity - модели таблиц
- repository - 
- generator - 
- processor - используется для работы с самими сущностями (entity, repository)
- service - проверяет принадлежность пользователя к комнате и вызывает методы процессора
- controller - описывает RestAPI вызовы