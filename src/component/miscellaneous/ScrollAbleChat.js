import { Avatar, Tooltip } from '@chakra-ui/react';
import { m } from 'framer-motion';
import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameUser, sameSenderMargin } from '../../config/ChatLogics';
import { GetContext } from '../../Context/chatProvide';
import { decodeToken } from './decode';

const ScrollAbleChat = ({ messages }) => {
    const { user } = GetContext();
    const decode = decodeToken(user?.token);
    // console.log(messages);
    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => {
                    return (
                        <div
                            style={{
                                display: 'flex',
                            }}
                            key={i}
                        >
                            {(isSameSender(messages, m, i, decode._id) || isLastMessage(messages, i, decode._id)) && (
                                <Tooltip label={m.sender.name} placement={'bottom'} hasArrow>
                                    <Avatar
                                        mt={'7px'}
                                        mr={1}
                                        size={'xs'}
                                        cursor={'pointer'}
                                        name={m.sender.name}
                                        src={m.sender.picture}
                                    />
                                </Tooltip>
                            )}
                            <span
                                style={{
                                    backgroundColor: ` ${m.sender._id === decode._id ? '#bee3f8' : '#B9F5D0'}
                                `,
                                    borderRadius: '20px',
                                    padding: '5px 15px',
                                    maxWidth: '75%',
                                    marginLeft: sameSenderMargin(messages, m, i, decode._id),
                                    marginTop: isSameUser(messages, m, i) ? 3 : 10,
                                }}
                            >
                                {m.content}
                            </span>
                        </div>
                    );
                })}
        </ScrollableFeed>
    );
};

export default ScrollAbleChat;
