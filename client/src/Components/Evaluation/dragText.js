import React, { useRef} from 'react';

export const DragText = (props) => {
    const textRef = useRef(null);
    const handleMouseUp = () => {
      // Change the color of the selected text
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        // Add a span element to highlight the selected text
        const span = document.createElement('span');
        span.style.color = '#ffffff';
        span.style.backgroundColor = '#00B7A1';
        span.style.borderRadius = '2px';
        selection.getRangeAt(0).surroundContents(span);
  
        // Save the selected text to the array
        props.setSelectedText([...props.selectedText, selection.toString()]);
      }
    };
  
    const resetSelectedText = () => {
      // Reset the selectedText state
      props.setSelectedText([]);
      
      // Find all span elements in the DOM
      const spans = textRef.current.querySelectorAll('span');
      
      // Loop through the spans and remove them one by one
      spans.forEach(span => {
        const text = span.textContent;
        span.parentNode.replaceChild(document.createTextNode(text), span);
      });

    };
  
    return (
      <div className='textDragHolder'>
        <div className='resetHolder'>
          <button className='dragReset' onClick={resetSelectedText}>RESET</button>          
        </div>
        <div className="dialogeHolder" ref={textRef} onMouseUp={handleMouseUp}>
          <div className="dialoge">
            {props.dialoge}
          </div>
        </div>
      </div>
    );
}
