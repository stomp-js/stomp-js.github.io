'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">stompjs@6.0.0-beta3, rx-stomp@1.0.0-beta5</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Client.html" data-type="entity-link">Client</a>
                            </li>
                            <li class="link">
                                <a href="classes/CompatClient.html" data-type="entity-link">CompatClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/RxStomp.html" data-type="entity-link">RxStomp</a>
                            </li>
                            <li class="link">
                                <a href="classes/RxStompConfig.html" data-type="entity-link">RxStompConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/RxStompRPC.html" data-type="entity-link">RxStompRPC</a>
                            </li>
                            <li class="link">
                                <a href="classes/RxStompRPCConfig.html" data-type="entity-link">RxStompRPCConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/Stomp.html" data-type="entity-link">Stomp</a>
                            </li>
                            <li class="link">
                                <a href="classes/StompConfig.html" data-type="entity-link">StompConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/StompHeaders.html" data-type="entity-link">StompHeaders</a>
                            </li>
                            <li class="link">
                                <a href="classes/StompSubscription.html" data-type="entity-link">StompSubscription</a>
                            </li>
                            <li class="link">
                                <a href="classes/Versions.html" data-type="entity-link">Versions</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/InjectableRxStompConfig.html" data-type="entity-link">InjectableRxStompConfig</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InjectableRxStompRPCConfig.html" data-type="entity-link">InjectableRxStompRPCConfig</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RxStompRPCService.html" data-type="entity-link">RxStompRPCService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RxStompService.html" data-type="entity-link">RxStompService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StompRService.html" data-type="entity-link">StompRService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StompService.html" data-type="entity-link">StompService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/IFrame.html" data-type="entity-link">IFrame</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMessage.html" data-type="entity-link">IMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPublishParams.html" data-type="entity-link">IPublishParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRxStompPublishParams.html" data-type="entity-link">IRxStompPublishParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITransaction.html" data-type="entity-link">ITransaction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IWatchParams.html" data-type="entity-link">IWatchParams</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});