import React from 'react';
import { createAssistant, createSmartappDebugger } from '@salutejs/client';

import './App.css';
import { MoodHistory } from './components/MoodHistory';
import { MoodChart } from './components/MoodChart';
import { classifyMood } from './utils/moodClassifier';

const initializeAssistant = (getState) => {
  if (process.env.NODE_ENV === 'development') {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? '',
      initPhrase: `Запусти ${process.env.REACT_APP_SMARTAPP}`,
      getState,
      nativePanel: {
        defaultText: 'Говорите!',
        screenshotMode: false,
        tabIndex: -1,
      },
    });
  }
  return createAssistant({ getState });
};

function makeEntry(text) {
  const { label, color, shape } = classifyMood(text);
  const now = new Date();
  const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  return {
    id: Math.random().toString(36).substring(7),
    text,
    moodLabel: label,
    color,
    shape,
    time,
  };
}

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      entries: [],
      inputValue: '',
    };

    this.assistant = initializeAssistant(() => this.getStateForAssistant());

    this.assistant.on('data', (event) => {
      console.log('assistant.on(data)', event);
      if (event.type === 'character' || event.type === 'insets') return;
      // $response.action из .sc файла приходит как event.action
      // $response.replies с smart_app_data приходит как event.smart_app_data
      if (event.type === 'smart_app_data' && event.smart_app_data) {
        this.dispatchAssistantAction(event.smart_app_data);
        return;
      }
      this.dispatchAssistantAction(event.action);
    });

    this.assistant.on('start', (event) => {
      console.log('assistant.on(start)', event);
    });

    this.assistant.on('error', (event) => {
      console.log('assistant.on(error)', event);
    });
  }

  getStateForAssistant() {
    return {
      item_selector: {
        items: this.state.entries.map(({ id, text }, index) => ({
          number: index + 1,
          id,
          title: text,
        })),
        ignored_words: ['добавь', 'добавить', 'запиши', 'настроение'],
      },
    };
  }

  dispatchAssistantAction(action) {
    console.log('dispatchAssistantAction', action);
    if (!action) return;
    switch (action.type) {
      case 'ADD_MOOD':
      case 'add_mood':
        this.addMood(action.payload || action.mood || action.note || '');
        break;
      case 'REMOVE_LAST_MOOD':
        this.removeLastMood();
        break;
      default:
        break;
    }
  }

  removeLastMood() {
    this.setState((prev) => ({ entries: prev.entries.slice(0, -1) }));
  }

  addMood(text) {
    if (!text || !text.trim()) return;
    const entry = makeEntry(text.trim());
    this.setState((prev) => ({ entries: [...prev.entries, entry] }));
  }

  handleInput = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const text = this.state.inputValue.trim();
    if (!text) return;
    this.addMood(text);
    this.setState({ inputValue: '' });
  };

  handleKeyDown = (e) => {
    if (e.key === 'Enter') this.handleSubmit(e);
  };

  render() {
    const { entries, inputValue } = this.state;

    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">Трекер настроения</h1>
          <p className="app-hint">Скажите «добавь хорошее настроение» или введите вручную</p>
        </header>

        <div className="app-body">
          {/* Input */}
          <div className="input-section">
            <form className="input-form" onSubmit={this.handleSubmit}>
              <input
                className="input-field"
                type="text"
                placeholder="добавь хорошее настроение..."
                value={inputValue}
                onChange={this.handleInput}
                onKeyDown={this.handleKeyDown}
              />
              <button className="input-btn" type="submit">Добавить</button>
            </form>
          </div>

          {/* Chart */}
          <div className="chart-section">
            <h2 className="section-title">График настроений</h2>
            <MoodChart entries={entries} />
          </div>

          {/* History */}
          <div className="history-section">
            <h2 className="section-title">История ({entries.length})</h2>
            <MoodHistory entries={entries} />
          </div>
        </div>
      </div>
    );
  }
}
