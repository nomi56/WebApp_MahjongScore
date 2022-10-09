import React from 'react';
import logo from './logo.svg';
import './App.css';

enum HandType {
    OTHER,
    SEVNE_PAIRS, // 七対子
    ALL_RUNS, // ピンフ
}

enum WaitType {
    TWO_GATE, // 両面
    MIDDLE, // カンチャン
    OUTSIDE, // ペンチャン
    SINGLE, // 単騎
}

enum SetType {
    PUNG, // ポン
    CONCEALED_PUNG, // 暗刻
    TERMINAL_PUNG, // 1･9字 ポン
    TERMINAL_CONCEALED_PUNG, // 1･9字 暗刻

    KAN, // カン
    CONCEALED_KAN, // 暗カン
    TERMINAL_KAN, // 1･9字 
    TERMINAL_CONCEALED_KAN, // 1･9字 暗カン

    PAIR, // 場風、字風、三元牌頭

    MAX,
}

enum FinishType {
    OPEN_HAND_RON,
    CLOSE_HAND_RON,
    TSUMO,
}

type SetInfo = {
    disp_name: string
    score: number
}

const set_info: { [type: number]: SetInfo } = {
    [SetType.PUNG]: { disp_name: "2-8 ポン", score: 2 },
    [SetType.CONCEALED_PUNG]: { disp_name: "2-8 暗刻", score: 4 },

    [SetType.TERMINAL_PUNG]: { disp_name: "1･9字 ポン", score: 4 },
    [SetType.TERMINAL_CONCEALED_PUNG]: { disp_name: "1･9字 暗刻", score: 8 },

    [SetType.KAN]: { disp_name: "2-8 カン", score: 8 },
    [SetType.CONCEALED_KAN]: { disp_name: "2-8 暗カン", score: 16 },

    [SetType.TERMINAL_KAN]: { disp_name: "1･9字 カン", score: 16 },
    [SetType.TERMINAL_CONCEALED_KAN]: { disp_name: "1･9字 暗カン", score: 32 },

    [SetType.PAIR]: { disp_name: "役牌頭", score: 2 },
}

interface IScoreLine {
    fu: string;
    score: string[];
}

var non_dealer_score_lines: { [id: number]: IScoreLine } = {
    0: { fu: "", score: ["1飜", "2飜", "3飜", "4飜"] },
    20: { fu: "20符", score: ["-\n-", "-\n400/700", "-\n700/1300", "-\n1300/2600"] },
    25: { fu: "25符", score: ["-\n-", "1600\n-", "3200\n800/1600", "6400\n1600/3200"] },
    30: { fu: "30符", score: ["1000\n300/500", "2000\n500/1000", "3900\n1000/2000", "*7700\n*2000/3900"] },
    40: { fu: "40符", score: ["1300\n400/700", "2600\n700/1300", "5200\n1300/2600", "満貫"] },
    50: { fu: "50符", score: ["1600\n400/800", "3200\n800/1600", "6400\n1600/3200", "満貫"] },
    60: { fu: "60符", score: ["2000\n500/1000", "3900\n1000/2000", "*7700\n*2000/3900", "満貫"] },
    70: { fu: "70符", score: ["2300\n600/1200", "4500\n1200/2300", "満貫", "満貫"] },
};

var dealer_score_lines: { [id: number]: IScoreLine } = {
    0: { fu: "", score: ["1飜", "2飜", "3飜", "4飜"] },
    20: { fu: "20符", score: ["-\n-", "-\n700all", "-\n1300all", "-\n2600all"] },
    25: { fu: "25符", score: ["-\n-", "2400\n-", "4800\n1600all", "9600\n3200all"] },
    30: { fu: "30符", score: ["1500\n500all", "2900\n1000all", "5800\n2000all", "*11600\n*3900all"] },
    40: { fu: "40符", score: ["2000\n700all", "3900\n1300all", "7700\n2600all", "満貫"] },
    50: { fu: "50符", score: ["2400\n800all", "4800\n1600all", "9600\n3200all", "満貫"] },
    60: { fu: "60符", score: ["2900\n1000all", "5800\n2000all", "*11600\n*3900all", "満貫"] },
    70: { fu: "70符", score: ["3400\n1200all", "6800\n2300all", "満貫", "満貫"] },
};

type State = {
    hand_type: HandType
    wait_type: WaitType
    finish_type: FinishType
    is_dealer: boolean
    counter: number[]
    result: string
    score_list: string
}


class Data extends React.Component<{}, State> {
    constructor(props: any) {
        super(props)

        this.state = {
            hand_type: HandType.OTHER,
            wait_type: WaitType.TWO_GATE,
            finish_type: FinishType.OPEN_HAND_RON,
            is_dealer: false,
            result: "0符",
            counter: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            score_list: "test<br>aaa"
        }
    }

    render() {
        return (
            <>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                手役：
                                <input
                                    type="button"
                                    value="その他"
                                    onClick={() => this.SetHandType(HandType.OTHER)}
                                />
                                <input
                                    type="button"
                                    value="ピンフ"
                                    onClick={() => this.SetHandType(HandType.ALL_RUNS)}
                                />
                                <input
                                    type="button"
                                    value="チートイ"
                                    onClick={() => this.SetHandType(HandType.SEVNE_PAIRS)}
                                />
                            </td>
                            <td align="left">
                                {["その他", "七対子", "ピンフ"][this.state.hand_type]}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                待ち：
                                <input
                                    type="button"
                                    value="両面"
                                    onClick={() => this.SetWaitType(WaitType.TWO_GATE)}
                                />
                                <input
                                    type="button"
                                    value="嵌張"
                                    onClick={() => this.SetWaitType(WaitType.MIDDLE)}
                                />
                                <input
                                    type="button"
                                    value="辺張"
                                    onClick={() => this.SetWaitType(WaitType.OUTSIDE)}
                                />
                                <input
                                    type="button"
                                    value="単騎"
                                    onClick={() => this.SetWaitType(WaitType.SINGLE)}
                                />
                            </td>
                            <td align="left">
                                {["両面 0符", "嵌張 2符", "辺張 2符", "単騎 2符"][this.state.wait_type]}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                上り形：
                                <input
                                    type="button"
                                    value="鳴きロン"
                                    onClick={() => this.SetFinishType(FinishType.OPEN_HAND_RON)}
                                />
                                <input
                                    type="button"
                                    value="面前ロン"
                                    onClick={() => this.SetFinishType(FinishType.CLOSE_HAND_RON)}
                                />
                                <input
                                    type="button"
                                    value="ツモ"
                                    onClick={() => this.SetFinishType(FinishType.TSUMO)}
                                />
                            </td>
                            <td align="left">
                                {["鳴きロン 0符", "面前ロン 10符", "ツモ 2符"][this.state.finish_type]}
                            </td>
                        </tr>
                        <tr style={{ height: 20 }} />
                        {this.RenderMemberRow(SetType.PUNG)}
                        {this.RenderMemberRow(SetType.CONCEALED_PUNG)}
                        {this.RenderMemberRow(SetType.TERMINAL_PUNG)}
                        {this.RenderMemberRow(SetType.TERMINAL_CONCEALED_PUNG)}
                        {this.RenderMemberRow(SetType.KAN)}
                        {this.RenderMemberRow(SetType.CONCEALED_KAN)}
                        {this.RenderMemberRow(SetType.TERMINAL_KAN)}
                        {this.RenderMemberRow(SetType.TERMINAL_CONCEALED_KAN)}
                        {this.RenderMemberRow(SetType.PAIR)}
                    </tbody>
                </table>
                <p className="result">{this.state.result}</p>
                <input
                    type="button"
                    value="リセット"
                    onClick={() => this.Reset()}
                />
                <p />
                <div className="score_board">
                    <a>点数表</a>
                    <div>
                        <input
                            type="button"
                            value=" 子 "
                            onClick={() => this.SetDealer(false)}
                        />
                        <input
                            type="button"
                            value=" 親 "
                            onClick={() => this.SetDealer(true)}
                        />
                        {this.state.is_dealer ? "親" : "子"}
                    </div>
                    {this.RenderScore(this.state.is_dealer)}
                </div>
                <p />
            </>
        )
    }

    RenderMemberRow(type: SetType) {
        return (
            <tr>
                <td>
                    <input
                        type="button"
                        value=" － "
                        onClick={() => this.CalcSetCount(type, -1)}
                    />
                    &emsp;{set_info[type].disp_name}&emsp;
                    <input
                        type="button"
                        value=" ＋ "
                        onClick={() => this.CalcSetCount(type, 1)}
                    />
                </td>
                <td align="left">
                    {set_info[type].score + "符 × " + this.state.counter[type]}
                </td>
            </tr>)
    }

    CalcSetCount(type: SetType, value: number) {
        var counter = this.state.counter
        counter[type] = Math.min(Math.max(counter[type] + value, 0), 4)
        this.setState({ counter: counter }, () => { this.UpdatePoint() })
    }

    SetDealer(is_dealer: boolean) {
        this.setState({ is_dealer: is_dealer })
    }

    SetHandType(h: HandType) {
        this.setState({ hand_type: h }, () => { this.UpdatePoint() })
        //    this.forceUpdate()
    }

    SetWaitType(t: WaitType) {
        this.setState({ wait_type: t }, () => { this.UpdatePoint() })
        //    this.forceUpdate()
    }

    SetFinishType(t: FinishType) {
        this.setState({ finish_type: t }, () => { this.UpdatePoint() })
    }

    UpdatePoint() {
        var total: number = 0

        for (var i = 0; i != SetType.MAX; i++) {
            total += set_info[i].score * this.state.counter[i]
        }

        if (this.state.wait_type != WaitType.TWO_GATE) total += 2 // 単騎待ちは２符
        total += [0, 10, 2][this.state.finish_type] // 待ち系による符

        var t: string
        switch (this.state.hand_type) {
            case HandType.OTHER: // その他
                t = "20符 + " + total + "符 → "
                total += 20;
                t = t + (Math.ceil(total / 10) * 10) + "符";
                break;

            case HandType.ALL_RUNS: // ピンフ
                total = this.state.finish_type == FinishType.TSUMO ? 20 : 30
                t = total + "符"
                break;

            case HandType.SEVNE_PAIRS: // 七対子
                total = 25
                t = total + "符"
                break;
        }

        this.setState({ result: t })
    }

    Reset() {
        this.state.counter.fill(0)
        this.setState({ finish_type: FinishType.OPEN_HAND_RON, wait_type: WaitType.TWO_GATE, hand_type: HandType.OTHER },
            () => { this.UpdatePoint() })
    }

    RenderScore(is_dealer: boolean) {
        return (
            <table className="score_list">
                <tbody>
                    {this.RenderScoreLine(is_dealer, 0)}
                    {this.RenderScoreLine(is_dealer, 20)}
                    {this.RenderScoreLine(is_dealer, 25)}
                    {this.RenderScoreLine(is_dealer, 30)}
                    {this.RenderScoreLine(is_dealer, 40)}
                    {this.RenderScoreLine(is_dealer, 50)}
                    {this.RenderScoreLine(is_dealer, 60)}
                    {this.RenderScoreLine(is_dealer, 70)}
                </tbody>
            </table >
        )
    }

    RenderScoreLine(is_dealer: boolean, fu: number) {
        var line = is_dealer ? dealer_score_lines[fu] : non_dealer_score_lines[fu]
        return (
            <tr>
                <td className="multiline_text">{line.fu}</td>
                <td className="multiline_text">{line.score[0]}</td>
                <td className="multiline_text">{line.score[1]}</td>
                <td className="multiline_text">{line.score[2]}</td>
                <td className="multiline_text">{line.score[3]}</td>
            </tr>)
    }
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                {/*<img src={logo} className="App-logo" alt="logo" />*/}
                <a>符数計算</a>
                <Data />
            </header>
        </div>
    );
}

export default App;


