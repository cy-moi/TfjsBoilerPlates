import React from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

class SketchExample extends React.Component {
  state = {
    displayColorPicker: false,
    color: {
      r: '241',
      g: '112',
      b: '19',
      a: '1',
    },
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    this.setState({ color: color.rgb })
  };

  componentDidMount (){
    const {onRef} = this.props;
    onRef && onRef(this)
  }

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '25px',
          height: '25px',
          borderRadius: '25px',
          background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
        },
        swatch: {
          display:'flex',
          height:'36px',
          width:'80px',
          marginRight:'10px',
          boxSizing:'border-box',
          padding: '5px',
          background: '#fff',
          borderRadius: '25px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          // display: 'inline-block',
          cursor: 'pointer',
        },
        text:{
          marginLeft:'10px',
          fontSize:'12px',
          lineHeight:'25px',
          color: 'rgba(35, 71, 178, 0.9)'
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div>
        <div style={ styles.swatch } onClick={ this.handleClick }>
          <div style={ styles.color } />
          <div style={styles.text}>Color</div>
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>
          <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
        </div> : null }
        
      </div>
    )
  }
}

export default SketchExample