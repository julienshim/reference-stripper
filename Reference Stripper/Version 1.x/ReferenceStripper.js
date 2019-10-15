// Reference Stripper

// Created by Julien Shim on 9/11/19.
// Copyright © 2019 Julien Shim. All rights reserved.

const ToggleButton = ({ isEasy, handleSettingsMode }) => (
  // <div>
  //  <button onClick={handleSettingsMode}>{isEasy ? "Easy" : "Advanced"}</button>
  // </div>
  <div id="toggle">
    <label class="switch">
      <input checked={isEasy} onClick={handleSettingsMode} type="checkbox" />
      <span class="slider"></span>
    </label>
    <p id="toggleLabel">{isEasy ? "Easy Mode \(BETA\)" : "Split Mode"}</p>
  </div>
);

const CircularProgressBar = ({ wordCount, size }) => {
  const percentage = (wordCount / 30) * 100;
  const radius = size;
  const strokeWidth = radius / 10;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const backgroundStyle = {
    strokeDashoffset,
    stroke:
      wordCount < 30
        ? "var(--ash)"
        : wordCount < 40
        ? "var(--peach)"
        : "transparent"
  };
  const progressStyle = {
    strokeDashoffset,
    stroke:
      wordCount < 20
        ? "var(--blue)"
        : wordCount < 30
        ? "var(--tangerine)"
        : wordCount < 40
        ? "var(--peach)"
        : "transparent"
  };
  const textStyle = { fill: wordCount < 30 ? "var(--ash)" : "var(--peach)" };
  return (
    <div id="circular-progress-bar">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          className="circle-background"
          strokeWidth={strokeWidth + 1}
          style={backgroundStyle}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className="circle-progress"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          style={progressStyle}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          className="circle-text"
          x="50%"
          y="50%"
          dy=".3rem"
          textAnchor="middle"
          style={textStyle}
        >
          {30 - wordCount}
        </text>
      </svg>
    </div>
  );
};

const Title = ({ title }) => <h1>{title}</h1>;

const Count = ({ length, wordCount }) => (
  <div id="count">{length + " characters / " + wordCount + " words"}</div>
);

const ConfirmButton = ({ className, text, onCopy, label, handleFlicker }) => (
  <CopyToClipboard onCopy={onCopy} text={text}>
    <div id="confirm" className={className} onClick={handleFlicker}>
      {label}
    </div>
  </CopyToClipboard>
);

class ReferenceStripper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Reference Stripper",
      input: "",
      output: "",
      copied: false,
      isEasy: false,
      start: 0,
      end: 0,
    };
  }

  handleChange = (value, type) => {
    console.log("before", this.input.selectionStart, this.input.selectionEnd);
    if (type === "input") {
     this.setState({start: this.input.selectionStart, end: this.input.selectionEnd});
    }
    this.setState({ [type]: value, copied: false }, () => {
     // console.log("after", this.state.start, this.state.end);
      if (type === "input") {
        this.handleChange(this.handleStrip(this.state.input), "output");

      }
                  this.input.setSelectionRange(this.state.start, this.state.end);

    });
  };

  handleSettingsMode = () => {
    this.setState(prevState => ({
      isEasy: !prevState.isEasy
    }));
  };

  handleFlicker = () => {
    this.setState({ flicker: true });
    const timer = setTimeout(() => {
      this.setState({ flicker: false });
    }, 75);

    return () => clearTimeout(timer);
  };

  handleWordCount = string => {
   // Regex Replace takes in account copy and pasted lists
    return string.replace(/[\n]/g, " ").split(" ").filter(function(n) {
      return n != "";
    }).length;
  };

  handleStrip = string => {
    let isWriting = true;
    let isQuoting = false;
    let hasClosed = true;
    let stripped = "";
    for (let i = 0; i < string.length; i++) {
      if (string[i] === "[" && !isQuoting) {
        isWriting = false;
        hasClosed = false;
      }
      // this saves the trouble of removing addresses when copying hyperlinked text
      if (
        string[i + 1] === "(" &&
        string[i + 2] === "h" &&
        string[i + 3] === "t" &&
        string[i + 4] === "t" &&
        string[i + 5] === "p"
      ) {
        isWriting = false;
        hasClosed = false;
      }
      if (string[i] === ")") {
        hasClosed = true;
        isWriting == true;
      }
      if (string[i] === '"') {
        isQuoting = !isQuoting;
      }
      if (string[i] === "]") {
        hasClosed = true;
      }
      if ((string[i] === " " ||
           string[i] === "," ||
           string[i] === "." ||
           string[i] === "!" ||
           string[i] === ";" ||
           string[i] === ":" ||
           string[i] === "?"
          ) && hasClosed) {
        isWriting = true;
      }
      if (isWriting) {
        stripped += string[i];
      }
    }
    // this.handleChange(stripped, "output");
    return stripped;
  };

  onCopy = () => {
    this.setState({ copied: true });
  };

  render() {
    const flickr =
      this.state.flicker && this.state.copied
        ? "flicker red"
        : this.state.copied
        ? "red"
        : "";

    const view = this.state.isEasy ? "easy-view" : "split-view";

    const placeholder =
      "Lorem ipsum dolor sit amet[1], consectetur adipiscing elit[citation needed], sed do eiusmod tempor incididunt ut labore et (https://en.wikipedia.org/wiki/Lorem_ipsum)[2], dolore (https://en.wikipedia.org/wiki/Lorem_ipsum) magna aliqua (https://en.wikipedia.org/wiki/Lorem_ipsum) ultrices sagittis orci a.[3]";

    return (
      <div id="container">
        <div id="header">
          <Title title={this.state.title} />
          <ToggleButton
            isEasy={this.state.isEasy}
            handleSettingsMode={this.handleSettingsMode}
          />
        </div>
        <div id="main">
          <div id="editor">
            <textarea
              id="input"
              value={this.state.isEasy ? this.state.output : this.state.input}
              placeholder={
                this.state.isEasy ? this.handleStrip(placeholder) : placeholder
              }
              class={`${view} ${this.state.isEasy && flickr}`}
              ref={ref => this.input = ref}
              onChange={event => {
               console.log(event.target.value); this.handleChange(event.target.value, "input");
              }}
            />
            {this.state.isEasy && (
              <CircularProgressBar
                wordCount={
                  this.state.output === ""
                    ? 23
                    : this.handleWordCount(
                        this.state.isEasy ? this.state.output : this.state.input
                      )
                }
                size={25}
              />
            )}
            {/* <Count length={this.state.input.length} wordCount={this.handleWordCount(this.state.input)} /> */}
            {this.state.isEasy && (
              <ConfirmButton
                className={this.state.copied ? "red confirm" : "confirm"}
                onCopy={this.onCopy}
                text={this.state.output}
                label={this.state.copied ? "Copied!" : "Copy"}
                handleFlicker={this.handleFlicker}
              />
            )}
                     {this.state.isEasy && <p className="warning">Warning: Any edits to text while in easy mode will irreversibly strip all references <span class="example"> e.g. [3]</span>, hyperlink URLs <span className ="example"> e.g. (https://en.wikipedia.org/wiki/Lorem_ipsum)</span>, and may also delete needed text (<em>if omitted by the current version stripping algorithm from view</em>) from the original inputted text. Use split mode if being able to view the original inputted text and stripped text side by side is critical to your work.</p>}
          </div>

          {!this.state.isEasy && (
            <CopyToClipboard onCopy={this.onCopy} text={this.state.output}>
            <div id="preview" onFocus={this.handleFlicker}>
              <textarea
                id="output"
                placeholder={this.handleStrip(placeholder)}
                value={this.state.output}
                class={`${view} ${flickr}`}
                readonly
              />
              <CircularProgressBar
                wordCount={
                  this.state.input === ""
                    ? 23
                    : this.handleWordCount(this.state.output)
                }
                size={25}
              />
              <ConfirmButton
                className={this.state.copied ? "red confirm" : "confirm"}
                onCopy={this.onCopy}
                text={this.state.output}
                label={this.state.copied ? "Copied!" : "Copy"}
                handleFlicker={this.handleFlicker}
              />
            </div>
           </CopyToClipboard>
          )}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<ReferenceStripper />, document.getElementById("app"));