function InfoTooltip({ isOpen, onClose, text, image }) {
    return ( 
        <>
        <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
        <div className="popup__container popup__container_type_tooltip">
            <button className="popup__close" onClick={onClose} />
            <img className="popup__note-img" src={image} alt={text} />
            <h2 className="popup__title popup__title_type_tooltip">{text}</h2>
        </div>
        </div>
        </>
       );
}
export default InfoTooltip;