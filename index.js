import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';



class Dropdown extends Component {
  constructor(props) {
    super(props)

    this._uid = 0;
    this.state = {
      selected: props.value || {
        label: props.placeholder || 'Select...',
        value: ''
      },
      isOpen: false
    }

    this.state.options = props.options.map((option) => {
      if (!option) {
        throw new Error("Empty options aren't allowed");
      }

      if (typeof option === 'string') {
        return {
          label: option,
          value: this._uid++
        };
      } else if (!option.value) {
        option.value = this._uid++;
      }

      return option;
    });

    this.mounted = true
    this.handleDocumentClick = this.handleDocumentClick.bind(this)
    this.fireChangeEvent = this.fireChangeEvent.bind(this)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value && newProps.value !== this.state.selected) {
      this.setState({
        selected: newProps.value
      });
    } else if (!newProps.value && newProps.placeholder) {
      this.setState({
        selected: {
          label: newProps.placeholder,
          value: ''
        }
      });
    }
  }

  listenGlobal() {
    document.addEventListener('mousedown', this.handleDocumentClick, true);
    document.addEventListener('touchstart', this.handleDocumentClick, true);
  }

  unlistenGlobal() {
    document.removeEventListener('mousedown', this.handleDocumentClick, true);
    document.removeEventListener('touchstart', this.handleDocumentClick, true);
  }

  componentWillUnmount() {
    this.mounted = false
    this.unlistenGlobal();
  }

  handleClick (event) {
    // event.stopPropagation();
    event.preventDefault();

    const isOpen = !this.state.isOpen;

    if (isOpen) {
      this.listenGlobal();
    } else {
      this.unlistenGlobal();
    }

    this.setState({ isOpen });
  }

  close() {
    this.unlistenGlobal();
    this.setState({ isOpen: false });
  }

  setValue(value, label) {
    let newState = {
      selected: {
        value,
        label
      },
      isOpen: false
    }

    this.unlistenGlobal();
    this.fireChangeEvent(newState)
    this.setState(newState)
  }

  fireChangeEvent (newState) {
    if (newState.selected !== this.state.selected && this.props.onChange) {
      this.props.onChange(newState.selected)
    }
  }

  getValue(option) {
    return option.value || option.label || option;
  }

  getLabel(option) {
    return option.label || option.value || option;
  }

  renderOption (option) {
    let value = this.getValue(option);
    let label = this.getLabel(option);

    let optionClass = classNames({
      [`${this.props.baseClassName}-option`]: true,
      'is-selected': value === this.getValue(this.state.selected)
    });

    return (
      <div
        key={value}
        className={optionClass}
        // onMouseDown={this.setValue.bind(this, value, label)}
        onClick={this.setValue.bind(this, value, label)}
      >
        <span style={{
          paddingLeft: (option.indent | 0) * 14 + 'px'
        }}>{ label }</span>
      </div>
    )
  }

  buildMenu() {
    let { baseClassName } = this.props;
    let { options } = this.state;

    let ops = options.map((option) => {
      if (option.type === 'group') {
        let groupTitle = (<div className={`${baseClassName}-title`}>{option.name}</div>)
        let _options = option.items.map((item) => this.renderOption(item))

        return (
          <div className={`${baseClassName}-group`} key={option.name}>
            {groupTitle}
            {_options}
          </div>
        )
      } else {
        return this.renderOption(option)
      }
    })

    return ops.length ? ops : <div className={`${baseClassName}-noresults`}>No options found</div>
  }

  handleDocumentClick(e) {
    if (this.mounted) {
      const elem = ReactDOM.findDOMNode(this);

      if (elem !== e.target && !elem.contains(e.target)) {
        this.close();
      }
    }
  }

  render () {
    const { baseClassName, menuTop } = this.props;
    const placeHolderValue = typeof this.state.selected === 'string' ?
      this.state.selected : this.state.selected.label;

    let menuClass = `${baseClassName}-menu` + (menuTop ? ` ${baseClassName}-menu-top` : '');
    let value = <div className={`${baseClassName}-placeholder`}>{placeHolderValue}</div>;
    let menu = this.state.isOpen ?
      <div className={ menuClass }>{this.buildMenu()}</div> : null;

    let dropdownClass = classNames({
      [`${baseClassName}-root`]: true,
      'is-open': this.state.isOpen
    })

    return (
      <div className={dropdownClass}>
        <div className={`${baseClassName}-control`} onClick={this.handleClick.bind(this)}>
          { value }
          <span className={`${baseClassName}-arrow`} />
        </div>
        { menu }
      </div>
    )
  }

}

Dropdown.defaultProps = { baseClassName: 'Dropdown' }
export default Dropdown
