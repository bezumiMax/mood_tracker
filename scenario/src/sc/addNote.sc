theme: /

    state: AddMood
        q!: (добавь | запиши | отметь | у меня) $AnyText::moodRaw
        script:
            var raw = $parseTree._moodRaw || '';
            var text = raw.toLowerCase().trim();
            text = text.replace(/настроение\s*/g, '').trim();
            if (text) {
                addAction({ type: 'ADD_MOOD', payload: text }, $context);
                $reactions.answer({ value: 'Понял, записываю: ' + text });
                addSuggestions(['Добавь хорошее настроение', 'Добавь плохое настроение', 'Удали последнее'], $context);
            } else {
                $reactions.answer({ value: 'Скажите, например: добавь хорошее настроение.' });
            }

    state: RemoveLast
        q!: (удали последнее | убери последнее | отмени последнее)
        script:
            addAction({ type: 'REMOVE_LAST_MOOD' }, $context);
            $reactions.answer({ value: 'Последняя запись удалена.' });
            addSuggestions(['Добавь хорошее настроение', 'Добавь плохое настроение'], $context);
