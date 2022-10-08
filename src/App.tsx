import React from 'react';
import logo from './logo.svg';
import './App.css';

enum HandType {
    OTHER,
    SEVNE_PAIRS, // 七対子
    ALL_RUNS, // ピンフ
}

type State = {
    hand_type: HandType
    is_leader: boolean
}

class Data extends React.Component<{}, State> {
    //const userAges: { [name: string]: number } = {};

    constructor(props: any) {
        super(props)
        this.state = { hand_type: HandType.OTHER, is_leader: false }
    }

    render() {
        return (
            <div>
                <p>
                    <a style={{ textAlign: "left" }}>
                        <input
                            type="button"
                            id="themeDeafault"
                            value="子"
                            onClick={() => this.SetLeader(false)}
                        />
                        <input
                            type="button"
                            id="themeDeafault"
                            value="親"
                            onClick={() => this.SetLeader(true)}
                        />
                    </a>
                    <a style={{ textAlign: "right" }}>{this.state.is_leader ? "親" : "子"}</a>
                </p>

                <p>
                    <input
                        type="button"
                        id="themeDeafault"
                        value="その他"
                        onClick={() => this.SetHandType(HandType.OTHER)}
                    />
                    <input
                        type="button"
                        id="themeDeafault"
                        value="ピンフ"
                        onClick={() => this.SetHandType(HandType.ALL_RUNS)}
                    />
                    <input
                        type="button"
                        id="themeDeafault"
                        value="チートイ"
                        onClick={() => this.SetHandType(HandType.SEVNE_PAIRS)}
                    />
                    <a>{["その他", "七対子", "ピンフ"][this.state.hand_type]}</a>
                </p>
            </div>
        )
    }

    SetLeader(is_leader: boolean) {
        this.setState({ is_leader: is_leader })
    }

    SetHandType(h: HandType) {
        this.setState({ hand_type: h })
    }
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <p style={{ textAlign: "center" }}>
                    府数計算
                    <Data />
                </p>
            </header>
        </div>
    );
}

export default App;


