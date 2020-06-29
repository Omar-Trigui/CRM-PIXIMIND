import React from 'react';
import ReactTypingEffect from 'react-typing-effect';
 
const ReactTypingEffectDemo = () => {
  return (
    <ReactTypingEffect
      text={["Contact Management", "Deals", "Appointment scheduling"]}
      speed={100}
      eraseDelay={200}
    />
  );
};
export default ReactTypingEffectDemo;