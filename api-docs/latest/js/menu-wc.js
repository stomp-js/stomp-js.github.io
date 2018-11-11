'use strict';



var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

customElements.define('compodoc-menu', function (_HTMLElement) {
    _inherits(_class, _HTMLElement);

    function _class() {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

        _this.isNormalMode = _this.getAttribute('mode') === 'normal';
        return _this;
    }

    _createClass(_class, [{
        key: 'connectedCallback',
        value: function connectedCallback() {
            this.render(this.isNormalMode);
        }
    }, {
        key: 'render',
        value: function render(isNormalMode) {
            let tp = lithtml.html(
'<nav>\n    <ul class="list">\n        <li class="title">\n            \n                <a href="index.html" data-type="index-link">stompjs-docs documentation</a>\n            \n        </li>\n\n        <li class="divider"></li>\n        ' + (isNormalMode ? '<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>' : '') + '\n        <li class="chapter">\n            <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>\n            <ul class="links">\n                \n                    <li class="link">\n                        <a href="index.html" data-type="chapter-link">\n                            <span class="icon ion-ios-keypad" ></span>Overview\n                        </a>\n                    </li>\n                \n                \n                \n                    <li class="link">\n                        <a href="dependencies.html"\n                            data-type="chapter-link">\n                            <span class="icon ion-ios-list"></span>Dependencies\n                        </a>\n                    </li>\n                \n            </ul>\n        </li>\n        \n        \n        \n        \n        \n        \n        <li class="chapter">\n            <div class="simple menu-toggler" data-toggle="collapse"\n            ' + (isNormalMode ? 'data-target="#classes-links"' : 'data-target="#xs-classes-links"') + '>\n                <span class="icon ion-ios-paper"></span>\n                <span>Classes</span>\n                <span class="icon ion-ios-arrow-down"></span>\n            </div>\n            <ul class="links collapse"\n            ' + (isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"') + '>\n                \n                    <li class="link">\n                        <a href="classes/Client.html" data-type="entity-link">Client</a>\n                    </li>\n                \n                    <li class="link">\n                        <a href="classes/CompatClient.html" data-type="entity-link">CompatClient</a>\n                    </li>\n                \n                    <li class="link">\n                        <a href="classes/Frame.html" data-type="entity-link">Frame</a>\n                    </li>\n                \n                    <li class="link">\n                        <a href="classes/Message.html" data-type="entity-link">Message</a>\n                    </li>\n                \n                    <li class="link">\n                        <a href="classes/RxStomp.html" data-type="entity-link">RxStomp</a>\n                    </li>\n                \n                    <li class="link">\n                        <a href="classes/RxStompConfig.html" data-type="entity-link">RxStompConfig</a>\n                    </li>\n                \n                    <li class="link">\n                        <a href="classes/RxStompRPC.html" data-type="entity-link">RxStompRPC</a>\n                    </li>\n                \n                    <li class="link">\n                        <a href="classes/RxStompRPCConfig.html" data-type="entity-link">RxStompRPCConfig</a>\n                    </li>\n                \n                    <li class="link">\n                        <a href="classes/Stomp.html" data-type="entity-link">Stomp</a>\n                    </li>\n                \n                    <li class="link">\n                        <a href="classes/StompConfig.html" data-type="entity-link">StompConfig</a>\n                    </li>\n                \n                    <li class="link">\n                        <a href="classes/StompHeaders.html" data-type="entity-link">StompHeaders</a>\n                    </li>\n                \n                    <li class="link">\n                        <a href="classes/StompSubscription.html" data-type="entity-link">StompSubscription</a>\n                    </li>\n                \n                    <li class="link">\n                        <a href="classes/Transaction.html" data-type="entity-link">Transaction</a>\n                    </li>\n                \n                    <li class="link">\n                        <a href="classes/Versions.html" data-type="entity-link">Versions</a>\n                    </li>\n                \n            </ul>\n        </li>\n        \n        \n            \n                <li class="chapter">\n                    <div class="simple menu-toggler" data-toggle="collapse"\n                        ' + (isNormalMode ? 'data-target="#injectables-links"' : 'data-target="#xs-injectables-links"') + '>\n                        <span class="icon ion-md-arrow-round-down"></span>\n                        <span>Injectables</span>\n                        <span class="icon ion-ios-arrow-down"></span>\n                    </div>\n                    <ul class="links collapse"\n                    ' + (isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"') + '>\n                        \n                            <li class="link">\n                                <a href="injectables/InjectableRxStompConfig.html" data-type="entity-link">InjectableRxStompConfig</a>\n                            </li>\n                        \n                            <li class="link">\n                                <a href="injectables/InjectableRxStompRpcConfig.html" data-type="entity-link">InjectableRxStompRpcConfig</a>\n                            </li>\n                        \n                            <li class="link">\n                                <a href="injectables/RxStompRPCService.html" data-type="entity-link">RxStompRPCService</a>\n                            </li>\n                        \n                            <li class="link">\n                                <a href="injectables/RxStompService.html" data-type="entity-link">RxStompService</a>\n                            </li>\n                        \n                            <li class="link">\n                                <a href="injectables/StompRService.html" data-type="entity-link">StompRService</a>\n                            </li>\n                        \n                            <li class="link">\n                                <a href="injectables/StompService.html" data-type="entity-link">StompService</a>\n                            </li>\n                        \n                    </ul>\n                </li>\n            \n        \n        \n        \n        \n        <li class="chapter">\n            <div class="simple menu-toggler" data-toggle="collapse"\n                ' + (isNormalMode ? 'data-target="#interfaces-links"' : 'data-target="#xs-interfaces-links"') + '>\n                <span class="icon ion-md-information-circle-outline"></span>\n                <span>Interfaces</span>\n                <span class="icon ion-ios-arrow-down"></span>\n            </div>\n            <ul class="links collapse"\n            ' + (isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"') + '>\n                \n                    <li class="link">\n                        <a href="interfaces/IPublishParams.html" data-type="entity-link">IPublishParams</a>\n                    </li>\n                \n            </ul>\n        </li>\n        \n        \n        \n        <li class="chapter">\n            <div class="simple menu-toggler" data-toggle="collapse"\n            ' + (isNormalMode ? 'data-target="#miscellaneous-links"' : 'data-target="#xs-miscellaneous-links"') + '>\n                <span class="icon ion-ios-cube"></span>\n                <span>Miscellaneous</span>\n                <span class="icon ion-ios-arrow-down"></span>\n            </div>\n            <ul class="links collapse"\n            ' + (isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"') + '>\n                \n                    <li class="link">\n                      <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>\n                    </li>\n                \n                \n                    <li class="link">\n                      <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>\n                    </li>\n                \n                \n                    <li class="link">\n                      <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>\n                    </li>\n                \n                \n            </ul>\n        </li>\n        \n        \n            \n        \n        \n        <li class="chapter">\n            <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>\n        </li>\n        \n        \n        \n    </ul>\n</nav>'
);
        this.innerHTML = tp.strings;
        }
    }]);

    return _class;
}(HTMLElement));