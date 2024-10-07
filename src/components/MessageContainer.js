const MessageContainer = ({ messages = []}) => {
  console.log("Dữ liệu tin nhắn:", messages);
  return (
    <div>
      {messages.map((msg, index) => (
        <div key={index}>
          <strong>{msg.username}:</strong> {msg.msg}
        </div>
      ))}
    </div>
  );
}


export default MessageContainer;
