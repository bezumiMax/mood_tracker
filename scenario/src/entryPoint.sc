require: slotfilling/slotFilling.sc
  module = sys.zb-common

require: js/reply.js

require: sc/addNote.sc

patterns:
    $AnyText = $nonEmptyGarbage

theme: /

    state: Start
        q!: $regex</start>
        q!: (запусти | открой | включи) (MoodTracker | трекер настроения | mood tracker)
        script:
            $reactions.answer({ value: 'Трекер настроения запущен. Скажите: добавь хорошее настроение.' });
            addSuggestions(['Добавь хорошее настроение', 'Добавь плохое настроение'], $context);

    state: Fallback
        event!: noMatch
        script:
            $reactions.answer({ value: 'Скажите: добавь настроение. Например: добавь хорошее настроение.' });
            addSuggestions(['Добавь хорошее настроение', 'Добавь плохое настроение', 'Удали последнее'], $context);
