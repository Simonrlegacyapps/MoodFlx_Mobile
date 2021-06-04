import React, { Component } from "react";
import { View } from 'react-native';
import PropTypes from 'prop-types'
import AsyncStorage from '@react-native-community/async-storage';

import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

import { SvgXml } from 'react-native-svg';

class CustomFastSVG extends Component {

  constructor(props) {
    super(props);

    this.state = { fill: props.fill, svgXmlData: null };

    this.fetchSVGData = this.fetchSVGData.bind(this);

    this.isComponentMounted = false;

    // Gets the image data from an URL or a static file
    if (props.source) {
      const source = resolveAssetSource(props.source) || {};
      this.fetchSVGData(source.uri);
    }
  }

  componentDidMount() {
    this.isComponentMounted = true;
  }

  componentDidUpdate(prevProps) {
    if (this.props.source) {
      const source = resolveAssetSource(this.props.source) || {};
      const oldSource = resolveAssetSource(prevProps.source) || {};
      if (source.uri !== oldSource.uri) {
        this.fetchSVGData(source.uri);
      }
    }

    // if (this.props.svgXmlData !== prevProps.svgXmlData) {
    //   this.setState({ svgXmlData: this.props.svgXmlData });
    // }

    if (this.props.fill !== this.props.fill) {
      this.setState({ fill: this.props.fill });
    }
  }

  componentWillUnmount() {
    this.isComponentMounted = false
  }

  async fetchSVGData(uri) {
    let responseXML = null, error = null;
    try {
      const value = await AsyncStorage.getItem(uri);
      if (value) {
        responseXML = value;
      } else {
        const response = await fetch(uri);
        responseXML = await response.text();
        if (!this.props.noCache) AsyncStorage.setItem(uri, responseXML);
      }
    } catch (e) {
      error = e;
      console.error("ERROR SVG", e);
    } finally {
      if (this.isComponentMounted) {
        this.setState({ svgXmlData: responseXML }, () => {
          const { onLoad } = this.props;
          if (onLoad && !error) {
            onLoad();
          }
        });
      }
    }

    return responseXML;
  }


  //   componentWillMount() {
  //     this.isComponentMounted = true;
  //   }

  //   componentWillReceiveProps (nextProps){
  //     if (nextProps.source) {
  //       const source = resolveAssetSource(nextProps.source) || {};
  //       const oldSource = resolveAssetSource(this.props.source) || {};
  //       if(source.uri !== oldSource.uri){
  //         this.fetchSVGData(source.uri);
  //       }
  //     }

  //     if (nextProps.svgXmlData !== this.props.svgXmlData) {
  //       this.setState({ svgXmlData: nextProps.svgXmlData });
  //     }

  //     if (nextProps.fill !== this.props.fill) {
  //       this.setState({ fill: nextProps.fill });
  //     }
  //   }

  //   componentWillUnmount() {
  //     this.isComponentMounted = false
  //   }

  //   async fetchSVGData(uri) {
  //     let responseXML = null, error = null;
  //     try {
  //       const value = await AsyncStorage.getItem(uri);
  //       if (value) {
  //         responseXML = value;
  //       } else {
  //         const response = await fetch(uri);
  //         responseXML = await response.text();
  //         if (!this.props.noCache) AsyncStorage.setItem(uri, responseXML);
  //       }
  //     } catch(e) {
  //       error = e;
  //       console.error("ERROR SVG", e);
  //     } finally {
  //       if (this.isComponentMounted) {
  //         this.setState({ svgXmlData: responseXML }, () => {
  //           const { onLoad } = this.props;
  //           if (onLoad && !error) {
  //             onLoad();
  //           }
  //         });
  //       }
  //     }

  //     return responseXML;
  //   }

  render() {
    if (!this.state.svgXmlData) {
      return null;
    }
    return (
      <View style={this.props.style}>
        <SvgXml xml={this.state.svgXmlData} override={this.props} />
      </View>
    );
  }
}

CustomFastSVG.propTypes = {
  style: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  svgXmlData: PropTypes.string,
  source: PropTypes.any,
  fill: PropTypes.string,
  onLoad: PropTypes.func,
  fillAll: PropTypes.bool
}

export default CustomFastSVG;