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
                    <a href="index.html" data-type="index-link">stompjs@7.0.0-beta3, rx-stomp@2.0.0-beta1</a>
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
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
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
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Client.html" data-type="entity-link" >Client</a>
                            </li>
                            <li class="link">
                                <a href="classes/CompatClient.html" data-type="entity-link" >CompatClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/RxStomp.html" data-type="entity-link" >RxStomp</a>
                            </li>
                            <li class="link">
                                <a href="classes/RxStompConfig.html" data-type="entity-link" >RxStompConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/RxStompRPC.html" data-type="entity-link" >RxStompRPC</a>
                            </li>
                            <li class="link">
                                <a href="classes/RxStompRPCConfig.html" data-type="entity-link" >RxStompRPCConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/Stomp.html" data-type="entity-link" >Stomp</a>
                            </li>
                            <li class="link">
                                <a href="classes/StompConfig.html" data-type="entity-link" >StompConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/StompHeaders.html" data-type="entity-link" >StompHeaders</a>
                            </li>
                            <li class="link">
                                <a href="classes/TCPWrapper.html" data-type="entity-link" >TCPWrapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/Versions.html" data-type="entity-link" >Versions</a>
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
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/IFrame.html" data-type="entity-link" >IFrame</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMessage.html" data-type="entity-link" >IMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPublishParams.html" data-type="entity-link" >IPublishParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRxStompPublishParams.html" data-type="entity-link" >IRxStompPublishParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITransaction.html" data-type="entity-link" >ITransaction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IWatchParams.html" data-type="entity-link" >IWatchParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StompSubscription.html" data-type="entity-link" >StompSubscription</a>
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
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
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