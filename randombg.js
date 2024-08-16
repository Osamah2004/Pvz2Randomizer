function setRandomBackground() {
    const backgrounds = [
        'BG/bgA.png', 
        'BG/bgB.png', 
        'BG/bgC.png', 
        'BG/bgD.png', 
        'BG/bgF.png', 
        'BG/bgG.png',
        'BG/bgE.png',
        'BG/bgH.png'
    ];
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    document.body.style.backgroundImage = `url('${backgrounds[randomIndex]}')`;
}
document.addEventListener('DOMContentLoaded', function() {
    setRandomBackground();
});
