import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';

import { setValue, clearValues } from '@appbaseio/reactivecore/lib/actions';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { connect } from '../../utils';
import {
	getInnerKey,
} from '@appbaseio/reactivecore/lib/utils/helper';

class SelectedFilters extends Component {
	remove = (component) => {
		this.props.setValue(component, null);
	};

	renderValue = (value, isArray) => {
		if (isArray && value.length) {
			const arrayToRender = value.map(item => this.renderValue(item));
			return arrayToRender.join(', ');
		} else if (value && typeof value === 'object') {
			// TODO: support for NestedList
			if (value.label || value.key) {
				return value.label || value.key;
			}
			return null;
		}
		return value;
	}
	_onPressClearAll = () => {
		this.props.clearValues()

		if(this.props.onClearAll) {
			this.props.onClearAll()
		}
	}
	render() {
		const { selectedValues } = this.props;
		let hasValues = false;

		return (
			<View style={this.props.style}>
				{
					Object.keys(selectedValues)
						.filter(id => this.props.components.includes(id) && selectedValues[id].showFilter)
						.map((component, index) => {
							const { label, value } = selectedValues[component];
							const isArray = Array.isArray(value);

							if (label && ((isArray && value.length) || (!isArray && value))) {
								hasValues = true;
								return (
									<Button
										light
										style={{
											height: 28,
											paddingVertical: 4,
											marginVertical: 2,
											...getInnerKey(this.props.innerStyle, 'button')
										}}
										key={`${component}-${index}`} // eslint-disable-line
										onPress={() => this.remove(component)}
									>
										<Text
											numberOfLines={1}
											style={{
												paddingLeft: 8,
												paddingRight: 4,
												fontSize: 14,
												...getInnerKey(this.props.innerStyle, 'buttonText')
											}}
										>
											{selectedValues[component].label}: {this.renderValue(value, isArray)}
										</Text>
										<Text
											style={{
												paddingLeft: 4,
												paddingRight: 8,
												fontSize: 14,
												...getInnerKey(this.props.innerStyle, 'closeButtonText')
											}}
										>
											&#x2715;
										</Text>
									</Button>
								);
							}
							return null;
						})
				}
				{
					this.props.showClearAll && hasValues
						? (
							<Button
								light
								style={{
									height: 28,
									paddingVertical: 4,
									marginVertical: 2,
									...getInnerKey(this.props.innerStyle, 'button')
								}}
								onPress={this._onPressClearAll}
							>
								<Text
									style={{
										paddingLeft: 8,
										paddingRight: 8,
										fontSize: 14,
										...getInnerKey(this.props.innerStyle, 'buttonText')
									}}
								>
									{this.props.clearAllLabel}
								</Text>
							</Button>
						)
						: null
				}
			</View>
		);
	}
}

SelectedFilters.propTypes = {
	selectedValues: types.selectedValues,
	setValue: types.func,
	clearValues: types.func,
	components: types.components,
	style: types.style,
	showClearAll: types.bool,
	clearAllLabel: types.title,
	innerStyle: types.style,
	onClearAll: types.func
};

SelectedFilters.defaultProps = {
	style: {},
	showClearAll: true,
	clearAllLabel: 'Clear All',

};

const mapStateToProps = state => ({
	selectedValues: state.selectedValues,
	components: state.components,
});

const mapDispatchtoProps = dispatch => ({
	setValue: (component, value) => dispatch(setValue(component, value)),
	clearValues: () => (dispatch(clearValues())),
});

export default connect(mapStateToProps, mapDispatchtoProps)(SelectedFilters);
