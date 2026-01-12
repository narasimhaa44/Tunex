import React, { useState, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import { MdDragHandle } from 'react-icons/md';

const SwipeableSongItem = ({ children, onQueue, className, style, onClick, onDragStart, onDragOver, onDrop, onDragEnd, isDraggable = true, ...props }) => {
    const [startX, setStartX] = useState(0);
    const [offsetX, setOffsetX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [itemWidth, setItemWidth] = useState(0);
    const ref = useRef(null);
    const threshold = 100; // px to trigger queue

    const hasMoved = useRef(false); // ⭐ Track if moved

    const handleStart = (clientX) => {
        setStartX(clientX);
        setIsDragging(true);
        hasMoved.current = false; // Reset
        if (ref.current) setItemWidth(ref.current.offsetWidth);
    };

    const handleMove = (clientX) => {
        if (!isDragging) return;
        const diff = clientX - startX;

        // ⭐ Check for significant movement to flag as drag
        if (Math.abs(diff) > 5) {
            hasMoved.current = true;
        }

        // Only allow dragging to the right (positive diff)
        if (diff > 0) {
            setOffsetX(diff);
        }
    };

    const handleEnd = () => {
        if (offsetX > threshold) {
            onQueue();
        }
        setIsDragging(false);
        setOffsetX(0);
    };

    // ⭐ Smart Click Handler
    const handleClick = (e) => {
        if (hasMoved.current || offsetX > 5) {
            // It was a drag, do not trigger click
            e.stopPropagation();
            return;
        }
        if (onClick) onClick(e);
    };

    // Mouse Events
    const onMouseDown = (e) => handleStart(e.clientX);
    const onMouseMove = (e) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();
    const onMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            setOffsetX(0);
        }
    };

    // Touch Events
    const onTouchStart = (e) => handleStart(e.touches[0].clientX);
    const onTouchMove = (e) => handleMove(e.touches[0].clientX);
    const onTouchEnd = () => handleEnd();

    // Calculate opacity of the green background based on drag distance
    const opacity = Math.min(offsetX / threshold, 1);

    return (
        <div
            style={{ position: 'relative', touchAction: 'pan-y', width: '100%', cursor: 'pointer' }}
            onClick={handleClick} // ⭐ Use smart handler
            title={props.title}
        >
            {/* Green Background Indicator */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '100%',
                backgroundColor: '#1db954',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '20px',
                opacity: opacity,
                zIndex: 0,
                // transform: `translateX(${offsetX - itemWidth}px)`,
            }}>
                <span style={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaPlus /> Add to Queue
                </span>
            </div>

            {/* Sliding Content - This receives the actual layout styling */}
            <div
                ref={ref}
                className={className} // ⭐ Apply class to inner div
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{
                    ...style, // ⭐ Apply style to inner div
                    transform: `translateX(${offsetX}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                    backgroundColor: style?.backgroundColor || 'inherit', // Ensure bg is handled
                    position: 'relative',
                    zIndex: style?.zIndex || 1, // ⭐ Allow custom zIndex override
                    display: 'flex', // Ensure items are aligned
                    alignItems: 'center',
                    gap: '12px',
                    // If the passed style had display: flex, it works here.
                }}
                {...props}
                draggable={false} // Disable default drag for content
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                {/* Drag Handle for Reordering */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {children}
                </div>
            </div>

            {/* Reveal Green Bar Reveal Icon */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: `${offsetX}px`,
                backgroundColor: '#1db954',
                zIndex: 2, // Above content to mask? No, zIndex 0 is behind.
                // But wait, if we slide RIGHT, we want to see what's BEHIND.
                // The zIndex 0 background is behind ZIndex 1 content. Correct.
                display: 'none' // We don't need this overlay if we have the background.
            }}>
            </div>
        </div>
    );
};

export default SwipeableSongItem;
