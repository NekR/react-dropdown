'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dropdown = function (_Component) {
  _inherits(Dropdown, _Component);

  function Dropdown(props) {
    _classCallCheck(this, Dropdown);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Dropdown).call(this, props));

    _this._uid = 0;
    _this.state = {
      selected: props.value || {
        label: props.placeholder || 'Select...',
        value: ''
      },
      isOpen: false
    };

    _this.state.options = props.options.map(function (option) {
      if (!option) {
        throw new Error("Empty options aren't allowed");
      }

      if (typeof option === 'string') {
        return {
          label: option,
          value: _this._uid++
        };
      } else if (!option.value) {
        option.value = _this._uid++;
      }

      return option;
    });

    _this.mounted = true;
    _this.handleDocumentClick = _this.handleDocumentClick.bind(_this);
    _this.fireChangeEvent = _this.fireChangeEvent.bind(_this);
    return _this;
  }

  _createClass(Dropdown, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
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
  }, {
    key: 'listenGlobal',
    value: function listenGlobal() {
      document.addEventListener('mousedown', this.handleDocumentClick, true);
      document.addEventListener('touchstart', this.handleDocumentClick, true);
    }
  }, {
    key: 'unlistenGlobal',
    value: function unlistenGlobal() {
      document.removeEventListener('mousedown', this.handleDocumentClick, true);
      document.removeEventListener('touchstart', this.handleDocumentClick, true);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.mounted = false;
      this.unlistenGlobal();
    }
  }, {
    key: 'handleClick',
    value: function handleClick(event) {
      // event.stopPropagation();
      event.preventDefault();

      var isOpen = !this.state.isOpen;

      if (isOpen) {
        this.listenGlobal();
      } else {
        this.unlistenGlobal();
      }

      this.setState({ isOpen: isOpen });
    }
  }, {
    key: 'close',
    value: function close() {
      this.unlistenGlobal();
      this.setState({ isOpen: false });
    }
  }, {
    key: 'setValue',
    value: function setValue(value, label) {
      var newState = {
        selected: {
          value: value,
          label: label
        },
        isOpen: false
      };

      this.unlistenGlobal();
      this.fireChangeEvent(newState);
      this.setState(newState);
    }
  }, {
    key: 'fireChangeEvent',
    value: function fireChangeEvent(newState) {
      if (newState.selected !== this.state.selected && this.props.onChange) {
        this.props.onChange(newState.selected);
      }
    }
  }, {
    key: 'getValue',
    value: function getValue(option) {
      return option.value || option.label || option;
    }
  }, {
    key: 'getLabel',
    value: function getLabel(option) {
      return option.label || option.value || option;
    }
  }, {
    key: 'renderOption',
    value: function renderOption(option) {
      var _classNames;

      var value = this.getValue(option);
      var label = this.getLabel(option);

      var optionClass = (0, _classnames2.default)((_classNames = {}, _defineProperty(_classNames, this.props.baseClassName + '-option', true), _defineProperty(_classNames, 'is-selected', value === this.getValue(this.state.selected)), _classNames));

      return _react2.default.createElement(
        'div',
        {
          key: value,
          className: optionClass
          // onMouseDown={this.setValue.bind(this, value, label)}
          , onClick: this.setValue.bind(this, value, label)
        },
        _react2.default.createElement(
          'span',
          { style: {
              paddingLeft: (option.indent | 0) * 14 + 'px'
            } },
          label
        )
      );
    }
  }, {
    key: 'buildMenu',
    value: function buildMenu() {
      var _this2 = this;

      var baseClassName = this.props.baseClassName;
      var options = this.state.options;


      var ops = options.map(function (option) {
        if (option.type === 'group') {
          var groupTitle = _react2.default.createElement(
            'div',
            { className: baseClassName + '-title' },
            option.name
          );
          var _options = option.items.map(function (item) {
            return _this2.renderOption(item);
          });

          return _react2.default.createElement(
            'div',
            { className: baseClassName + '-group', key: option.name },
            groupTitle,
            _options
          );
        } else {
          return _this2.renderOption(option);
        }
      });

      return ops.length ? ops : _react2.default.createElement(
        'div',
        { className: baseClassName + '-noresults' },
        'No options found'
      );
    }
  }, {
    key: 'handleDocumentClick',
    value: function handleDocumentClick(e) {
      if (this.mounted) {
        var elem = _reactDom2.default.findDOMNode(this);

        if (elem !== e.target && !elem.contains(e.target)) {
          this.close();
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _classNames2;

      var _props = this.props;
      var baseClassName = _props.baseClassName;
      var menuTop = _props.menuTop;

      var placeHolderValue = typeof this.state.selected === 'string' ? this.state.selected : this.state.selected.label;

      var menuClass = baseClassName + '-menu' + (menuTop ? ' ' + baseClassName + '-menu-top' : '');
      var value = _react2.default.createElement(
        'div',
        { className: baseClassName + '-placeholder' },
        placeHolderValue
      );
      var menu = this.state.isOpen ? _react2.default.createElement(
        'div',
        { className: menuClass },
        this.buildMenu()
      ) : null;

      var dropdownClass = (0, _classnames2.default)((_classNames2 = {}, _defineProperty(_classNames2, baseClassName + '-root', true), _defineProperty(_classNames2, 'is-open', this.state.isOpen), _classNames2));

      return _react2.default.createElement(
        'div',
        { className: dropdownClass },
        _react2.default.createElement(
          'div',
          { className: baseClassName + '-control', onClick: this.handleClick.bind(this) },
          value,
          _react2.default.createElement('span', { className: baseClassName + '-arrow' })
        ),
        menu
      );
    }
  }]);

  return Dropdown;
}(_react.Component);

Dropdown.defaultProps = { baseClassName: 'Dropdown' };
exports.default = Dropdown;